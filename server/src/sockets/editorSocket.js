export default function editorSocketHandler(io, socket) {
  socket.on("editor-update", (data) => {
    socket.to(data.room).emit("editor-update", data);
  });
}