const whiteboardSocketHandler = require('./whiteboardSocket');
const editorSocketHandler = require('./editorSocket');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected: ' + socket.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log('Socket ' + socket.id + ' joined room ' + roomId);
    });

    whiteboardSocketHandler(io, socket);
    editorSocketHandler(io, socket);

    socket.on('disconnect', () => {
      console.log('Socket disconnected: ' + socket.id);
    });
  });
};