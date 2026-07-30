import { SOCKET_EVENTS } from "../shared/socketEvents.js";

export default function editorSocketHandler(io, socket, getJoinedRoom, canEdit) {
  for (const eventName of [SOCKET_EVENTS.EDITOR_UPDATE, SOCKET_EVENTS.CODE_CHANGE]) {
    socket.on(eventName, (data = {}) => {
      const roomCode = getJoinedRoom(data.room);
      if (roomCode && canEdit(roomCode)) socket.to(roomCode).emit(eventName, data);
    });
  }
}
