const editorSocketHandler = require('./editorSocket');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log('Socket connected: ' + socket.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log('Socket ' + socket.id + ' joined room ' + roomId);
    });

    try {
      const { default: whiteboardSocketHandler } = await import('./whiteboardSocket.mjs');
      whiteboardSocketHandler(io, socket);
    } catch (err) {
      console.error('Failed to load whiteboardSocket ESM module:', err);
    }

    editorSocketHandler(io, socket);

    socket.on('disconnect', () => {
      console.log('Socket disconnected: ' + socket.id);
    });
  });
};