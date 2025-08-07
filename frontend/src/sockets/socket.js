import { io } from "socket.io-client";

let socket;

export const getSocket = (token) => {
  if (!socket || !socket.connected) {
    socket = io("http://localhost:5000", {
      auth: { token },
    });
  }
  return socket;
};
