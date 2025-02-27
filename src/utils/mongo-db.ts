import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("⚡ Already connected to MongoDB");
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
