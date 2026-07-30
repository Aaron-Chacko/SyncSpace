import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("🟢 Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection Error:", err.message);
});

export default socket;