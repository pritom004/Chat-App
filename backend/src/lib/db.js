import mongoose from "mongoose";

export const connectDB = async () => {
  try {

    mongoose.connection.once("connected", () => {
      console.log("Mongoose connected to the database.");
    });

    await mongoose.connect(process.env.DATABASE_URL);
   
  } catch (error) {
    console.error("Mongodb connection failed", error)
  }
};
