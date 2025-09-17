import User from '../models/user.models';
import { connect } from '../mongodb/mongoose'; // Changed from connectToDB to connect

// Define types for email addresses from Clerk
interface ClerkEmailAddress {
  email_address: string;
  id: string;
  verification: {
    status: string;
    strategy: string;
  };
}

// Define the user type that matches your MongoDB schema
interface DatabaseUser {
  _id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  favs: Array<{ // Changed from 'fav' to 'favs' to match your route
    movieId: number; // Changed from string to number (movie IDs are typically numbers)
    title: string;
    description: string;
    dateReleased: Date;
    rating: number;
    image: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export const createOrUpdateUser = async (
  id: string, 
  first_name: string, 
  last_name: string, 
  image_url: string, 
  email_addresses: ClerkEmailAddress[]
): Promise<DatabaseUser> => {
  try {
    await connect(); // Changed from connectToDB to connect
    
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_addresses[0]?.email_address
        }
      },
      { upsert: true, new: true, runValidators: true }
    );
    
    if (!user) {
      throw new Error("User not found or created");
    }
    
    return user as DatabaseUser;
  } catch (error) {
    console.error("Error: Could not create/update user", error);
    throw new Error(`Could not create/update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await connect(); // Changed from connectToDB to connect
    
    const result = await User.findOneAndDelete({ clerkId: id });
    
    if (!result) {
      console.warn(`User with clerkId ${id} not found for deletion`);
    }
  } catch (error) {
    console.error("Error: Could not delete user", error);
    throw new Error(`Could not delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Additional utility function to get user by clerkId
export const getUserByClerkId = async (clerkId: string): Promise<DatabaseUser | null> => {
  try {
    await connect();
    const user = await User.findOne({ clerkId });
    return user as DatabaseUser | null;
  } catch (error) {
    console.error("Error fetching user by clerkId:", error);
    throw new Error(`Could not fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to update user favorites (if needed elsewhere)
export const updateUserFavorites = async (
  clerkId: string, 
  favorites: DatabaseUser['favs']
): Promise<DatabaseUser> => {
  try {
    await connect();
    
    const user = await User.findOneAndUpdate(
      { clerkId },
      { $set: { favs: favorites } },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user as DatabaseUser;
  } catch (error) {
    console.error("Error updating user favorites:", error);
    throw new Error(`Could not update favorites: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}