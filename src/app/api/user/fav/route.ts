import User from '../../../lib/models/user.models';
import { connect } from '../../../lib/mongodb/mongoose';
import { currentUser, createClerkClient } from '@clerk/nextjs/server';

// ✅ PUT = Add or remove a favorite
export const PUT = async (req: Request) => {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!user.publicMetadata.userMongoId) {
      return new Response(JSON.stringify({ error: 'User MongoDB ID not found in metadata' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connect();

    let data;
    try {
      data = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!data.movieId) {
      return new Response(JSON.stringify({ error: 'movieId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ✅ Normalize to string
    const movieId = String(data.movieId);

    const existingUser = await User.findById(user.publicMetadata.userMongoId);
    if (!existingUser) {
      return new Response(JSON.stringify({ error: 'User not found in database' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let updatedUser;
    const isAlreadyFavorite = existingUser.favs.some((fav) => fav.movieId === movieId);

    if (isAlreadyFavorite) {
      // ✅ Remove
      updatedUser = await User.findByIdAndUpdate(
        user.publicMetadata.userMongoId,
        { $pull: { favs: { movieId } } },
        { new: true, runValidators: true }
      );
    } else {
      // ✅ Add
      if (!data.title) {
        return new Response(JSON.stringify({ error: 'title is required when adding to favorites' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      updatedUser = await User.findByIdAndUpdate(
        user.publicMetadata.userMongoId,
        {
          $addToSet: {
            favs: {
              movieId,
              title: data.title,
              description: data.overview || '',
              dateReleased: data.releaseDate ? new Date(data.releaseDate) : null,
              rating: data.voteCount ? Number(data.voteCount) : 0,
              image: data.image || '',
            },
          },
        },
        { new: true, runValidators: true }
      );
    }

    if (!updatedUser) {
      throw new Error('User update failed');
    }

    // ✅ Sync Clerk metadata
    try {
      const updatedFavs = updatedUser.favs.map((fav) => fav.movieId);
      const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

      await clerk.users.updateUserMetadata(user.id, {
        publicMetadata: {
          ...user.publicMetadata,
          favs: updatedFavs,
        },
      });
    } catch (err) {
      console.error('Clerk metadata update error:', err);
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: updatedUser,
        action: isAlreadyFavorite ? 'removed' : 'added',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error in /api/user/fav PUT:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// ✅ GET = Retrieve all favorites
export const GET = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!user.publicMetadata.userMongoId) {
      return new Response(JSON.stringify({ error: 'User MongoDB ID not found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connect();
    const dbUser = await User.findById(user.publicMetadata.userMongoId);

    if (!dbUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ favs: dbUser.favs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /api/user/fav GET:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
