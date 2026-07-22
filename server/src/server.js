import http from "http";
import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./sockets/index.js";

dotenv.config();

async function startServer() {
  try {
    await connectDB();

    const server = http.createServer(app);

    initializeSocket(server);

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();