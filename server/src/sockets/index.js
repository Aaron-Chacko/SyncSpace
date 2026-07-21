import { Server } from "socket.io";
import { SOCKET_EVENTS } from "../shared/socketEvents.js";
import editorSocketHandler from "./editorSocket.js";

export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomCode) => {
      console.log(`${socket.id} joined room ${roomCode}`);

      socket.join(roomCode);

      io.to(roomCode).emit(SOCKET_EVENTS.USER_JOINED, {
        socketId: socket.id,
        roomCode,
      });
    });

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomCode) => {
      console.log(`${socket.id} left room ${roomCode}`);

      socket.leave(roomCode);

      io.to(roomCode).emit(SOCKET_EVENTS.USER_LEFT, {
        socketId: socket.id,
        roomCode,
      });
    });

    try {
      const { default: whiteboardSocketHandler } = await import("./whiteboardSocket.mjs");
      whiteboardSocketHandler(io, socket);
    } catch (err) {
      console.error("Failed to load whiteboardSocket ESM module:", err);
    }

    editorSocketHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
    });
  });

  return io;
}