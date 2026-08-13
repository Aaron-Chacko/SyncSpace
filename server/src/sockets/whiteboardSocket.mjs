import { SOCKET_EVENTS } from "../shared/socketEvents.js";

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);

export default function whiteboardSocketHandler(io, socket, getJoinedRoom, canEdit, roomCanvases) {

  // draw-element: finalized element → store in canvas state + relay to others
  socket.on(SOCKET_EVENTS.DRAW_ELEMENT, (data = {}) => {
    const roomCode = getJoinedRoom(data.room);
    if (!roomCode || !canEdit(roomCode) || !data.element || typeof data.element !== "object") return;
    if (!roomCanvases.has(roomCode)) roomCanvases.set(roomCode, []);
    roomCanvases.get(roomCode).push(data.element);
    socket.to(roomCode).emit(SOCKET_EVENTS.DRAW_ELEMENT, data.element);
  });

  // update-element: updated position/size → update canvas state + relay
  socket.on(SOCKET_EVENTS.UPDATE_ELEMENT, (data = {}) => {
    const roomCode = getJoinedRoom(data.room);
    if (!roomCode || !canEdit(roomCode) || !data.element || typeof data.element !== "object") return;
    const canvas = roomCanvases.get(roomCode);
    if (canvas) {
      const idx = canvas.findIndex((el) => el.id === data.element.id);
      if (idx !== -1) canvas[idx] = data.element;
    }
    socket.to(roomCode).emit(SOCKET_EVENTS.UPDATE_ELEMENT, data.element);
  });

  // delete-elements: eraser deleted elements → remove from canvas state + relay
  socket.on("delete-elements", (data = {}) => {
    const roomCode = getJoinedRoom(data.room);
    if (!roomCode || !canEdit(roomCode) || !Array.isArray(data.ids)) return;
    const canvas = roomCanvases.get(roomCode);
    if (canvas) {
      const idSet = new Set(data.ids);
      roomCanvases.set(roomCode, canvas.filter((el) => !idSet.has(el.id)));
    }
    socket.to(roomCode).emit("delete-elements", data.ids);
  });

  // draw-in-progress: relay live strokes to other users (not stored)
  socket.on("draw-in-progress", (data = {}) => {
    const roomCode = getJoinedRoom(data.room);
    if (!roomCode || !canEdit(roomCode) || !data.element || typeof data.element !== "object") return;
    socket.to(roomCode).emit("draw-in-progress", {
      socketId: socket.id,
      element: data.element,
    });
  });

  // draw-line legacy relay
  socket.on(SOCKET_EVENTS.DRAW_LINE, (data = {}) => {
    const roomCode = getJoinedRoom(data.room);
    if (roomCode && canEdit(roomCode)) socket.to(roomCode).emit(SOCKET_EVENTS.DRAW_LINE, data);
  });

  // clear-canvas: clear stored state + broadcast to all users in room
  socket.on(SOCKET_EVENTS.CLEAR_CANVAS, (data = {}) => {
    const roomCode = getJoinedRoom(data.room);
    if (!roomCode || !canEdit(roomCode)) return;
    roomCanvases.set(roomCode, []);
    socket.to(roomCode).emit(SOCKET_EVENTS.CLEAR_CANVAS);
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
