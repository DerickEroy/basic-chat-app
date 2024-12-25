import mongoose from "mongoose";
import { DB_URI } from "./config";

export async function connectToMongoDB() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}
