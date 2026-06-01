import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (
    window.electronAPI
      ? "http://127.0.0.1:5000"
      : undefined
  );

if (!socketUrl) {
  throw new Error(
    "VITE_SOCKET_URL or VITE_API_BASE_URL is not configured"
  );
}

const socket = io(socketUrl, {
  transports: ["websocket"],
});

export default socket;
