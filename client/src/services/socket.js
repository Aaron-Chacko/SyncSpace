import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL ?? "http://localhost:5000", { autoConnect: false });

export const connectSocket = (token) => {
  socket.auth = { token };
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => socket.disconnect();
export default socket;
