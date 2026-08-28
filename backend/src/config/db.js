import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // Set to console.log to debug SQL queries
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Auto-creates or updates tables
    console.log("✅ MySQL Connected & Synchronized");
  } catch (error) {
    console.error("❌ Unable to connect to MySQL:", error.message);
    process.exit(1);
  }
};

export default sequelize;









// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI); 
// //! This await is necessary to ensure we connect to the database before starting the server.
// //! JavaScript doesn't wait for MongoDB to actually connect.
// //! It starts the connection and immediately continues:
// //!So your message could appear before MongoDB is actually connected.
//     console.log("✅ MongoDB Connected");
//   } catch (error) {
//     console.log(error.message);
//     process.exit(1); //stops your Node.js server.
//   }
// };

// export default connectDB;