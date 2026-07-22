import http from "http";
import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";
import initSocket from "./config/socket.js";
import registerSockets from "./sockets/index.js";

dotenv.config();

connectDB();

const server = http.createServer(app);
const io = initSocket(server);

registerSockets(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
