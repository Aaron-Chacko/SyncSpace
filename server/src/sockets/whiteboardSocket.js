module.exports = (io, socket) => {
  socket.on('draw-line', (data) => {
    socket.to(data.room).emit('draw-line', data);
  });
};