import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
    );
  }

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, { dbName: "podcasty" });
    isConnected = true;
    console.log("MongoDB is connected");
  } catch (error) {
    console.log(error);
  }
};
