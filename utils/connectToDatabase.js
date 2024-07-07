import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function () {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}`
    );

    console.log("Database Connected Successfully ✅");
  } catch (error) {
    console.log(`Error Occured while connecting Database: ${error}`);
  }
}
