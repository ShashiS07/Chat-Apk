const express = require("express");
const cors = require("cors");
const app = express();
const { connection } = require("./database/connection");
const { port } = require("./config");
const socketIo = require("socket.io");

// database connection

connection();

// import routes

const authRouter = require("./routes/Auth");
const userRouter = require("./routes/User");
const { isSocketAuthenticated } = require("./middleware/middleware");
const { sendMessage } = require("./controllers/User");

// cors

const corsOptioins = {
  origin: "*",
  method: "GET,PUT,PATCH,DELETE,POST,HEAD",
  credentials: true,
};

app.use(cors(corsOptioins));

// body parser

app.use(express.json());
app.use(express.urlencoded({}));

// user routes

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// server connection

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port} 🔥`);
});

const io = socketIo(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.use(isSocketAuthenticated);

let activeUsers = {};

io.on("connection", (socket) => {
  socket.on("adduser", (data) => {
    activeUsers[data.id] = socket.id;
    socket.join(data.id);
    io.emit("onlineuser", data.id);
    io.emit("updateOnlineUsers", Array.from(activeUsers));
  });

  socket.on("joinchat", (room) => {
    try {
      console.log("room", room.id);
      socket.join(room.id);
    } catch (error) {
      socket.emit("error", { message: "Failed to Join user" });
    }
  });

  socket.on("newmessage", async ({ data, id }) => {
    try {
      console.log("newmessage is called");
      socket.in(id).emit("recievemessage", data.data);
    } catch (error) {
      socket.emit("error", { message: "Failed to Join user" });
    }
  });

  socket.on("sendmessage", async (body, callback) => {
    try {

      let { senderId, receiverId, message } = body;

      let chatMessage = {
        senderId,
        receiverId,
        message,
        createdAt: new Date(),
      };

      callback({ success: true, data: chatMessage });

      io.to(receiverId).emit("receivemessage", { senderId, message });
    } catch (error) {
      callback({ error: error.message });
    }
  });

  socket.on("typing", ({ senderId, receiverId, isTyping }) => {
    io.to(receiverId).emit("usertyping", { senderId, isTyping });
  });

  socket.on("disconnect", () => {
    let userId = Object.keys(activeUsers).find(
      (key) => activeUsers[key] === socket.id
    );
    if (userId) {
      delete activeUsers[userId];
      io.emit("offlineuser", userId);
      io.emit("updateOnlineUsers", Array.from(activeUsers));
    }
  });
});
