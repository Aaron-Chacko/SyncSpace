export default (io, socket) => {
  // Broadcast drawing element (line, rectangle, circle, straight-line, text)
  socket.on('draw-element', (data) => {
    if (data.roomId) {
      socket.to(data.roomId).emit('draw-element', data.element);
    }
  });

  // Legacy line drawing fallback
  socket.on('draw-line', (data) => {
    const room = data.room || data.roomId;
    if (room) {
      socket.to(room).emit('draw-line', data);
    }
  });

  // Broadcast user live cursor position with name
  socket.on('cursor-move', (data) => {
    if (data.roomId) {
      socket.to(data.roomId).emit('cursor-move', {
        socketId: socket.id,
        x: data.x,
        y: data.y,
        userName: data.userName || 'Anonymous',
        userColor: data.userColor || '#6366f1'
      });
    }
  });

  // Broadcast clear canvas event
  socket.on('clear-canvas', (data) => {
    if (data.roomId) {
      socket.to(data.roomId).emit('clear-canvas');
    }
  });
};
