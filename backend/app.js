require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const app = express();
const server = http.createServer(app);
const userRouter = require("./routes/userRouter");
const homeRouter = require("./routes/homeRouter");
const adminRouter = require("./routes/adminRouter");
const swipeRouter = require("./routes/swipeRouter");
const utilRouter = require("./routes/utilRouter");
const chatRouter = require("./routes/chatRouter");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
const cors = require("cors");

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow any localhost origin for development
      if (
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1") ||
        origin.startsWith(process.env.FRONTEND_URL)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin
      if (!origin) return callback(null, true);

      // Allow any localhost origin for development
      if (
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1") ||
        origin.startsWith(process.env.FRONTEND_URL)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a chat room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Send message
  socket.on("send-message", (data) => {
    io.to(data.roomId).emit("receive-message", data);
  });

  // Typing indicator
  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("user-typing", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set("io", io);

app.use("/user", userRouter);

app.use("/home", homeRouter);

app.use("/swipe", swipeRouter);

app.use("/admin", adminRouter); // For testing purposes  // can make a admin dashboard in future

app.use("/chat", chatRouter);

app.use("/", utilRouter);

server.listen(PORT, () => {
  console.log("server is running on ", PORT);
});
