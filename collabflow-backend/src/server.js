import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./websocket/socket.js";

import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initializeSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});