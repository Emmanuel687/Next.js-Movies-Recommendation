import User from '../models/user.models';
import { connectToDB } from '../mongodb/mongoose';

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
  fav: Array<{
    movieId: string;
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
    await connectToDB();
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
      { upsert: true, new: true }
    );
    return user as DatabaseUser;
  } catch (error) {
    console.error("Error: Could not create/update user", error);
    throw error;
  }
}

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await connectToDB();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.error("Error: Could not delete user", error);
    throw error;
  }
}