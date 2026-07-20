export default (io, socket) => {
  // Sync shape/line drawings
  socket.on('draw-element', (data) => {
    if (data && data.room) {
      socket.to(data.room).emit('draw-element', data.element);
    }
  });

  socket.on('draw-line', (data) => {
    if (data && data.room) {
      socket.to(data.room).emit('draw-line', data);
    }
  });

  // Sync canvas clear
  socket.on('clear-canvas', (data) => {
    if (data && data.room) {
      socket.to(data.room).emit('clear-canvas');
    }
  });

  // Sync multiplayer mouse cursor positions
  socket.on('cursor-move', (data) => {
    if (data && data.room) {
      socket.to(data.room).emit('cursor-move', {
        socketId: socket.id,
        x: data.x,
        y: data.y,
        name: data.name || 'Collaborator',
        color: data.color || '#06b6d4'
      });
    }
  });

  // Notify room on disconnect to clear user cursor
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit('cursor-leave', { socketId: socket.id });
    });
  });
};
