const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config({ path: __dirname + "/.env" });

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", async (data) => {
    const message = new Message(data);
    await message.save();

    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// MongoDB connection
// MongoDB connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("❌ MongoDB error:", err.message);
    console.log("🔄 Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
