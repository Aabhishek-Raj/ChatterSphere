// lib/socket-server.ts
import { Server } from "socket.io";

type IOServer = Server | null;

// Add type to global
declare global {
  var _io: IOServer;
}

export const getIO = () => {
  if (!global._io) {
    throw new Error("Socket.io not initialized");
  }
  return global._io;
};

export const initIO = (server: any) => {
  if (!global._io) {
    const io = new Server(server, {
      cors: {
        origin: "*",  // or your domain
      },
    });

    io.on("connection", (socket) => {
      console.log("SOCKET CONNECTED:", socket.id);
    });

    global._io = io;
  }

  return global._io;
};
