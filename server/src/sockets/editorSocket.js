import * as Y from "yjs";
import yjsService from "../services/yjsService.mjs";
import { SOCKET_EVENTS } from "../shared/socketEvents.js";

export default function editorSocketHandler(io, socket, getJoinedRoom, canEdit) {
  // Listen for client joining Yjs session
  socket.on("yjs-join", ({ roomId }) => {
    if (!roomId) return;
    socket.join(roomId);

    const doc = yjsService.getDoc(roomId);
    const stateUpdate = Y.encodeStateAsUpdate(doc);

    socket.emit("yjs-init", Buffer.from(stateUpdate));
  });

  // Listen for Yjs document updates from client
  socket.on("yjs-update", ({ roomId, update }) => {
    if (!roomId || !update) return;
    const roomCode = getJoinedRoom(roomId) || roomId;
    if (canEdit && !canEdit(roomCode)) return;

    try {
      const doc = yjsService.getDoc(roomId);
      Y.applyUpdate(doc, new Uint8Array(update));
      socket.to(roomId).emit("yjs-update", update);
    } catch (err) {
      console.error("Yjs update error:", err);
    }
  });

  // Listen for Yjs awareness updates from client
  socket.on("yjs-awareness", ({ roomId, update }) => {
    if (!roomId || !update) return;
    socket.to(roomId).emit("yjs-awareness", update);
  });

  // Legacy fallback editor sync events
  for (const eventName of [
    SOCKET_EVENTS.EDITOR_UPDATE,
    SOCKET_EVENTS.CODE_CHANGE,
  ]) {
    socket.on(eventName, (data = {}) => {
      const roomCode = getJoinedRoom(data.room);
      if (roomCode && canEdit(roomCode)) {
        socket.to(roomCode).emit(eventName, data);
      }
    });
  }
}