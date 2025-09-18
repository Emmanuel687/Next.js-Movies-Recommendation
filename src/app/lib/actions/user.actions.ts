import User from "../models/user.models";
import { connect } from "../mongodb/mongoose";
import { IUser } from "../models/user.models"; // Import the interface from your model

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
// Use the IUser interface and add the Mongoose-specific fields
interface DatabaseUser extends Omit<IUser, keyof Document> {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

export const createOrUpdateUser = async (
  id: string,
  first_name: string,
  last_name: string,
  image_url: string,
  email_addresses: ClerkEmailAddress[]
): Promise<DatabaseUser> => {
  try {
    await connect();

    const userDoc = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_addresses[0]?.email_address,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    if (!userDoc) {
      throw new Error("User not found or created");
    }

    // Convert to plain object and return with proper typing
    const userObject = userDoc.toObject();
    return {
      _id: userObject._id.toString(),
      clerkId: userObject.clerkId,
      firstName: userObject.firstName,
      lastName: userObject.lastName,
      email: userObject.email,
      profilePicture: userObject.profilePicture,
      favs: userObject.favs,
      createdAt: userObject.createdAt,
      updatedAt: userObject.updatedAt,
      __v: userObject.__v
    } as DatabaseUser;
  } catch (error) {
    console.error("Error: Could not create/update user", error);
    throw new Error(
      `Could not create/update user: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await connect();

    const result = await User.findOneAndDelete({ clerkId: id });

    if (!result) {
      console.warn(`User with clerkId ${id} not found for deletion`);
    }
  } catch (error) {
    console.error("Error: Could not delete user", error);
    throw new Error(
      `Could not delete user: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getUserByClerkId = async (
  clerkId: string
): Promise<DatabaseUser | null> => {
  try {
    await connect();
    const userDoc = await User.findOne({ clerkId }).lean();
    
    if (!userDoc) return null;
    
    // Return with proper typing
    return {
      _id: userDoc._id.toString(),
      clerkId: userDoc.clerkId,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      email: userDoc.email,
      profilePicture: userDoc.profilePicture,
      favs: userDoc.favs,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
      __v: userDoc.__v
    } as DatabaseUser;
  } catch (error) {
    console.error("Error fetching user by clerkId:", error);
    throw new Error(
      `Could not fetch user: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const updateUserFavorites = async (
  clerkId: string,
  favorites: DatabaseUser["favs"]
): Promise<DatabaseUser> => {
  try {
    await connect();

    const userDoc = await User.findOneAndUpdate(
      { clerkId },
      { $set: { favs: favorites } },
      { new: true, runValidators: true }
    );

    if (!userDoc) {
      throw new Error("User not found");
    }

    // Convert to plain object and return with proper typing
    const userObject = userDoc.toObject();
    return {
      _id: userObject._id.toString(),
      clerkId: userObject.clerkId,
      firstName: userObject.firstName,
      lastName: userObject.lastName,
      email: userObject.email,
      profilePicture: userObject.profilePicture,
      favs: userObject.favs,
      createdAt: userObject.createdAt,
      updatedAt: userObject.updatedAt,
      __v: userObject.__v
    } as DatabaseUser;
  } catch (error) {
    console.error("Error updating user favorites:", error);
    throw new Error(
      `Could not update favorites: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  };
};