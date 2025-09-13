import User from '../models/user.models';
import { connectToDB } from '../mongodb/mongoose';

export const createOrUpdateUser = async (
  id: string, 
  first_name: string, 
  last_name: string, 
  image_url: string, 
  email_addresses: any[]
) => {
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
    return user;
  } catch (error) {
    console.error("Error: Could not create/update user", error);
    throw error;
  }
}

export const deleteUser = async (id: string) => {
  try {
    await connectToDB();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.error("Error: Could not delete user", error);
    throw error;
  }
}