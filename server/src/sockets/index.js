import { Server } from "socket.io";
import { SOCKET_EVENTS } from "../shared/socketEvents.js";
import editorSocketHandler from "./editorSocket.js";
import whiteboardSocketHandler from "./whiteboardSocket.mjs";
import { verifyToken } from "../utils/token.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

const roomUsers = new Map();
// Persist whiteboard canvas state per room (survives user disconnects while room has members)
const roomCanvases = new Map();
// Persist room chat messages
const roomChats = new Map();

const normalizeRoomCode = (roomCode) => {
  if (typeof roomCode !== "string") return null;
  const normalized = roomCode.trim();
  return normalized.length > 0 && normalized.length <= 100 ? normalized : null;
};

const usersInRoom = (roomCode) => {
  const users = roomUsers.get(roomCode);
  if (!users) return [];
  // Deduplicate by userId — keep the latest socket entry per user
  const byUserId = new Map();
  for (const entry of users.values()) {
    byUserId.set(entry.userId, entry);
  }
  return [...byUserId.values()];
};

export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN?.split(",") ?? "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required."));

    try {
      const payload = verifyToken(token);
      const user = await User.findById(payload.id).select("_id name").lean();

      if (!user) return next(new Error("Authentication required."));

      socket.user = {
        id: user._id.toString(),
        name: user.name,
      };

      return next();
    } catch {
      return next(new Error("Invalid or expired token."));
    }
  });

  io.on("connection", (socket) => {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🟢 User Connected");
    console.log(`👤 Name      : ${socket.user.name}`);
    console.log(`🆔 Socket ID : ${socket.id}`);
    console.log(`👥 Active    : ${io.engine.clientsCount}`);
    console.log(`⏰ Time      : ${new Date().toLocaleTimeString()}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const leaveRoom = (roomCode) => {
      const users = roomUsers.get(roomCode);
      if (!users?.has(socket.id)) return false;

      users.delete(socket.id);
      socket.leave(roomCode);

      socket.to(roomCode).emit(SOCKET_EVENTS.CURSOR_LEAVE, {
        socketId: socket.id,
      });

      socket.to(roomCode).emit(SOCKET_EVENTS.USER_LEFT, {
        socketId: socket.id,
        roomCode,
      });

      if (users.size === 0) {
        roomUsers.delete(roomCode);
        // Keep canvas state alive until the last user leaves — then clear it too
        roomCanvases.delete(roomCode);
        roomChats.delete(roomCode);
      }

      io.to(roomCode).emit(
        SOCKET_EVENTS.ROOM_USERS,
        usersInRoom(roomCode)
      );

      console.log(`🚪 ${socket.user.name} left room ${roomCode}`);

      return true;
    };

    const getJoinedRoom = (roomCode) => {
      const normalized = normalizeRoomCode(roomCode);
      return normalized && roomUsers.get(normalized)?.has(socket.id)
        ? normalized
        : null;
    };

    const canEdit = (roomCode) =>
      Boolean(roomUsers.get(roomCode)?.get(socket.id)?.canEdit);

    socket.on(SOCKET_EVENTS.JOIN_ROOM, async (roomInput, acknowledgement) => {
      try {
        const roomCode = normalizeRoomCode(
          typeof roomInput === "object"
            ? roomInput?.roomCode
            : roomInput
        );

        if (!roomCode) {
          acknowledgement?.({
            ok: false,
            error: "A valid room code is required.",
          });
          return;
        }

        const room = await Room.findOne({
          roomCode,
          isActive: true,
          $or: [
            { creator: socket.user.id },
            { participants: socket.user.id },
          ],
        }).lean();

        if (!room) {
          acknowledgement?.({
            ok: false,
            error: "Room not found or access denied.",
          });
          return;
        }

        const isHost =
          room.creator.toString() === socket.user.id;

        // Host always gets edit access; other users need to be in editors list
        const canEditRoom =
          isHost ||
          ((room.editors ?? []).some(
            (editor) => editor.toString() === socket.user.id
          ));

        socket.join(roomCode);

        if (!roomUsers.has(roomCode))
          roomUsers.set(roomCode, new Map());

        const users = roomUsers.get(roomCode);

        // Remove any stale socket entries for the same userId (e.g. from a refresh)
        for (const [existingSocketId, existingUser] of users.entries()) {
          if (existingUser.userId === socket.user.id && existingSocketId !== socket.id) {
            users.delete(existingSocketId);
          }
        }

        const wasPresent = users.has(socket.id);

        users.set(socket.id, {
          socketId: socket.id,
          userId: socket.user.id,
          name: socket.user.name,
          isHost,
          canEdit: canEditRoom,
        });

        if (!wasPresent) {
          socket.to(roomCode).emit(
            SOCKET_EVENTS.USER_JOINED,
            {
              socketId: socket.id,
              roomCode,
            }
          );
        }

        io.to(roomCode).emit(
          SOCKET_EVENTS.ROOM_USERS,
          usersInRoom(roomCode)
        );

        console.log(`🏠 ${socket.user.name} joined room ${roomCode}`);

        // Send existing canvas state to the newly joined user
        const existingCanvas = roomCanvases.get(roomCode) || [];
        if (existingCanvas.length > 0) {
          socket.emit("canvas-state", existingCanvas);
        }

        // Send existing chat history to the newly joined user
        const existingChat = roomChats.get(roomCode) || [];
        if (existingChat.length > 0) {
          socket.emit("chat-history", existingChat);
        }

        acknowledgement?.({
          ok: true,
          roomCode,
          users: usersInRoom(roomCode),
          isHost,
          canEdit: canEditRoom,
        });
      } catch {
        acknowledgement?.({
          ok: false,
          error: "Unable to join room.",
        });
      }
    });

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomCode) => {
      const normalized = normalizeRoomCode(roomCode);
      if (normalized) leaveRoom(normalized);
    });

    socket.on(
      SOCKET_EVENTS.REQUEST_EDIT_ACCESS,
      (data = {}, acknowledgement) => {
        const roomCode = getJoinedRoom(data.room);
        const requester =
          roomCode && roomUsers.get(roomCode)?.get(socket.id);

        if (
          !roomCode ||
          !requester ||
          requester.isHost ||
          requester.canEdit
        ) {
          acknowledgement?.({
            ok: false,
            error: "You cannot request edit access for this room.",
          });
          return;
        }

        const host = [...roomUsers.get(roomCode).values()].find(
          (user) => user.isHost
        );

        if (!host) {
          acknowledgement?.({
            ok: false,
            error: "The host is not currently connected.",
          });
          return;
        }

        io.to(host.socketId).emit(
          SOCKET_EVENTS.EDIT_ACCESS_REQUESTED,
          {
            room: roomCode,
            userId: socket.user.id,
            name: socket.user.name,
          }
        );

        acknowledgement?.({ ok: true });
      }
    );

    socket.on(
      SOCKET_EVENTS.GRANT_EDIT_ACCESS,
      async (data = {}, acknowledgement) => {
        try {
          const roomCode = getJoinedRoom(data.room);
          const host =
            roomCode && roomUsers.get(roomCode)?.get(socket.id);

          if (
            !roomCode ||
            !host?.isHost ||
            typeof data.userId !== "string"
          ) {
            acknowledgement?.({
              ok: false,
              error: "Only the room host can change access.",
            });
            return;
          }

          const update =
            data.allow === false
              ? { $pull: { editors: data.userId } }
              : { $addToSet: { editors: data.userId } };

          await Room.updateOne(
            {
              roomCode,
              creator: socket.user.id,
              participants: data.userId,
            },
            update
          );

          for (const user of roomUsers.get(roomCode).values()) {
            if (user.userId === data.userId) {
              user.canEdit = data.allow !== false;

              io.to(user.socketId).emit(
                SOCKET_EVENTS.ACCESS_UPDATED,
                {
                  room: roomCode,
                  canEdit: user.canEdit,
                }
              );
            }
          }

          io.to(roomCode).emit(
            SOCKET_EVENTS.ROOM_USERS,
            usersInRoom(roomCode)
          );

          acknowledgement?.({ ok: true });
        } catch {
          acknowledgement?.({
            ok: false,
            error: "Unable to update edit access.",
          });
        }
      }
    );

    whiteboardSocketHandler(io, socket, getJoinedRoom, canEdit, roomCanvases);
    editorSocketHandler(io, socket, getJoinedRoom, canEdit);

    // Chat Message Event Handler
    socket.on("send-message", (data = {}) => {
      const roomCode = getJoinedRoom(data.room);
      if (!roomCode || typeof data.text !== "string" || !data.text.trim()) return;

      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        text: data.text.trim().slice(0, 2000),
        senderId: socket.user.id,
        senderName: socket.user.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (!roomChats.has(roomCode)) {
        roomChats.set(roomCode, []);
      }
      roomChats.get(roomCode).push(message);

      // Send to all other users in the room
      socket.to(roomCode).emit("receive-message", message);
    });

    socket.on("disconnecting", () => {
      for (const roomCode of [...roomUsers.keys()]) {
        leaveRoom(roomCode);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔴 User Disconnected");
      console.log(`👤 Name      : ${socket.user?.name ?? "Unknown User"}`);
      console.log(`🆔 Socket ID : ${socket.id}`);
      console.log(`👥 Active    : ${Math.max(io.engine.clientsCount - 1, 0)}`);
      console.log(`📄 Reason    : ${reason}`);
      console.log(`⏰ Time      : ${new Date().toLocaleTimeString()}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });
  });

  return io;
}