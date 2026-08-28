import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initializeSocket } from "./sockets/socket.js";
import startCronJobs from "./utils/cronJobs.js";
dotenv.config();
await connectDB();
startCronJobs();
const httpServer = createServer(app);
initializeSocket(httpServer);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});