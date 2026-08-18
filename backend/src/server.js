import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./sockets/socket.js"; 

dotenv.config();
await connectDB(); //! This await is necessary to ensure we connect to the database before starting the server.

const httpServer = createServer(app);

initializeSocket(httpServer);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});