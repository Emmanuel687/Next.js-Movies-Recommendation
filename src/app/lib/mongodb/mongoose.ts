import mongoose from "mongoose";

let initialized = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (initialized) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "new-next-imb",
    });
    initialized = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};