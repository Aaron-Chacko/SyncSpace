import { Server } from "socket.io";
import { SOCKET_EVENTS } from "../shared/socketEvents.js";
import editorSocketHandler from "./editorSocket.js";

const roomUsers = new Map();

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

      // Create room if it doesn't exist
      if (!roomUsers.has(roomCode)) {
        roomUsers.set(roomCode, []);
      }

      // Add user to room
      roomUsers.get(roomCode).push({
        socketId: socket.id,
      });


      io.to(roomCode).emit(SOCKET_EVENTS.USER_JOINED, {
        socketId: socket.id,
        roomCode,
      });

      io.to(roomCode).emit(SOCKET_EVENTS.ROOM_USERS, roomUsers.get(roomCode));
    });

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomCode) => {
      console.log(`${socket.id} left room ${roomCode}`);

      socket.leave(roomCode);

      if (roomUsers.has(roomCode)) {
        const updatedUsers = roomUsers
          .get(roomCode)
          .filter((user) => user.socketId !== socket.id);

        if (updatedUsers.length === 0) {
          roomUsers.delete(roomCode);
        } else {
          roomUsers.set(roomCode, updatedUsers);
        }

        io.to(roomCode).emit(SOCKET_EVENTS.ROOM_USERS, updatedUsers);
      }

      io.to(roomCode).emit(SOCKET_EVENTS.USER_LEFT, {
        socketId: socket.id,
        roomCode,
      });
    });

    try {
      const { default: whiteboardSocketHandler } =
        await import("./whiteboardSocket.mjs");
      whiteboardSocketHandler(io, socket);
    } catch (err) {
      console.error("Failed to load whiteboardSocket ESM module:", err);
    }

    editorSocketHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.id}`);

      for (const [roomCode, users] of roomUsers.entries()) {
        const updatedUsers = users.filter(
          (user) => user.socketId !== socket.id,
        );

        if (updatedUsers.length !== users.length) {
          if (updatedUsers.length === 0) {
            roomUsers.delete(roomCode);
          } else {
            roomUsers.set(roomCode, updatedUsers);
          }

          io.to(roomCode).emit(SOCKET_EVENTS.ROOM_USERS, updatedUsers);

          io.to(roomCode).emit(SOCKET_EVENTS.USER_LEFT, {
            socketId: socket.id,
            roomCode,
          });
        }
      }
    });
  });

  return io;
}
