import { SOCKET_EVENTS } from "../shared/socketEvents.js";

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);

export default function whiteboardSocketHandler(io, socket, getJoinedRoom, canEdit) {
  const relayElement = (eventName) => {
    socket.on(eventName, (data = {}) => {
      const roomCode = getJoinedRoom(data.room);
      if (!roomCode || !canEdit(roomCode) || !data.element || typeof data.element !== "object") return;
      socket.to(roomCode).emit(eventName, data.element);
    });
  };

  relayElement(SOCKET_EVENTS.DRAW_ELEMENT);
  relayElement(SOCKET_EVENTS.UPDATE_ELEMENT);

  // Relay live in-progress drawing strokes so other users see drawing happen in real-time
  socket.on("draw-in-progress", (data = {}) => {
    const roomCode = getJoinedRoom(data.room);
    if (!roomCode || !canEdit(roomCode) || !data.element || typeof data.element !== "object") return;
    socket.to(roomCode).emit("draw-in-progress", {
      socketId: socket.id,
      element: data.element,
    });
  });

  socket.on(SOCKET_EVENTS.DRAW_LINE, (data = {}) => {
    const roomCode = getJoinedRoom(data.room);
    if (roomCode && canEdit(roomCode)) socket.to(roomCode).emit(SOCKET_EVENTS.DRAW_LINE, data);
  });

  socket.on(SOCKET_EVENTS.CLEAR_CANVAS, (data = {}) => {
    const roomCode = getJoinedRoom(data.room);
    if (roomCode && canEdit(roomCode)) socket.to(roomCode).emit(SOCKET_EVENTS.CLEAR_CANVAS);
  });

  socket.on(SOCKET_EVENTS.CURSOR_MOVE, (data = {}) => {
    const roomCode = getJoinedRoom(data.room);
    if (!roomCode || !isFiniteNumber(data.x) || !isFiniteNumber(data.y)) return;

    socket.to(roomCode).emit(SOCKET_EVENTS.CURSOR_MOVE, {
      socketId: socket.id,
      x: data.x,
      y: data.y,
      name: socket.user?.name || "Collaborator",
      color: typeof data.color === "string" ? data.color.slice(0, 32) : "#06b6d4",
    });
  });
}
