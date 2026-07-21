import { Server } from "socket.io";
import { SOCKET_EVENTS } from "../shared/socketEvents.js";

export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
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

    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
    });
  });

  return io;
}