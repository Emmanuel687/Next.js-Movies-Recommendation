import User from '../models/user.models.js';
import { connectToDB } from '../mongodb/mongoose.js';

export const createOrUpdateUser = async (id, first_name, last_name, image_url, email_addresses) => {
  try {
    await connectToDB();
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_addresses[0]?.emailAddress
        }
      },
      { upsert: true, new: true }
    );
    return user;
  } catch (error) {
    console.error("Error: Could not delete user", error);
  }
}

export const deleteUser = async (id) => {
  try {
    await connectToDB();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.error("Error: Could not delete user", error);
  }
}