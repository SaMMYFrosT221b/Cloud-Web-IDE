import express from "express";
import * as http from "http";
import { Server } from "socket.io";
import pty from "node-pty";
import fs from "fs/promises";
import path from "path";
import cors from "cors";

// Creating a terminal
const ptyProcess = pty.spawn("bash", [], {
  name: "xterm-color",
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD + "/user",
  env: process.env,
});

const app = express();
app.use(cors());
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

app.get("/files", async (req, res) => {
  const fileTree = await generateFileTree("./user");
  return res.json({
    tree: fileTree,
  });
});

server.listen(9000, () => console.log("Docker server is running at PORT 9000"));

async function generateFileTree(directory) {
  const tree = {};

  async function buildTree(currentDir, currentTree) {
    const files = await fs.readdir(currentDir);
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        currentTree[file] = {};
        await buildTree(filePath, currentTree[file]);
      } else {
        currentTree[file] = null;
      }
    }
  }
  await buildTree(directory, tree);
  return tree;
}
