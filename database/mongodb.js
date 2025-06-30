import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.[development/production].local"
  );
}

//DB Connect
const connectToDB = async (params) => {
  try {
    await mongoose.connect(DB_URI);

    console.log(`Connected to database in ${NODE_ENV} mode`);
  } catch (error) {
    console.error("Error connecting to Database: ", error);

    process.exit(1);
  }
};

export default connectToDB;
