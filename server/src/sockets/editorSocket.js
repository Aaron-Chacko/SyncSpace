module.exports = (io, socket) => {
  socket.on('editor-update', (data) => {
    socket.to(data.room).emit('editor-update', data);
  });
};