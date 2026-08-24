import express from "express";
import cors from "cors";
// import errorMiddleware from "./middlewares/error.middleware.js"; //! removed because it is not used in the project.
import authRoutes from "./routes/auth.routes.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";//! removed because it is not used in the project.
import loggerMiddleware from "./middlewares/logger.middleware.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); //This allows Express to understand JSON data sent in the request body.
app.use(express.urlencoded({ extended: true }));//This allows Express to understand data sent using the URL-encoded format, commonly from traditional HTML forms.
app.use(loggerMiddleware);



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);


export default app;