import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); 
//! This await is necessary to ensure we connect to the database before starting the server.
//! JavaScript doesn't wait for MongoDB to actually connect.
//! It starts the connection and immediately continues:
//!So your message could appear before MongoDB is actually connected.
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1); //stops your Node.js server.
  }
};

export default connectDB;