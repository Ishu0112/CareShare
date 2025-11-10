const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { authCheck } = require("../middlewares/authCheck");

// Get all chats for current user
router.get("/", authCheck, chatController.getUserChats);

// Get or create chat with a specific user
router.post("/create", authCheck, chatController.getOrCreateChat);

// Get specific chat by ID
router.get("/:chatId", authCheck, chatController.getChatById);

// Send a message in a chat
router.post("/:chatId/message", authCheck, chatController.sendMessage);

// Mark messages as read
router.put("/:chatId/read", authCheck, chatController.markAsRead);

// Delete a chat
router.delete("/:chatId", authCheck, chatController.deleteChat);

module.exports = router;
