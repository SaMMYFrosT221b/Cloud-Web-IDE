import express from "express";
import * as http from "http";
import { Server } from "socket.io";
import pty from "node-pty";

// Creating a terminal
const ptyProcess = pty.spawn("bash", [], {
  name: "xterm-color",
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD,
  env: process.env,
});

const app = express();
const server = http.createServer(app);
const io = new Server({
  cors: "*",
});

io.attach(server);

ptyProcess.onData((data) => {
  io.emit("terminal:data", data);
});

io.on("connection", (socket) => {
  console.log("Socket Connteced", socket.id);

  socket.on("terminal:write", (data) => {
    ptyProcess.write(data);
  });
});

server.listen(9000, () => console.log("Docker server is running at PORT 9000"));
