const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [messageSchema],
  lastMessage: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to ensure each pair of users has only one chat
chatSchema.index({ participants: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);
