const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Get or create chat between two users
exports.getOrCreateChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user._id;

    if (!participantId) {
      return res.status(400).json({ error: "Participant ID is required" });
    }

    // Sort participant IDs to ensure consistent ordering
    const participants = [userId, participantId].sort();

    // Find existing chat
    let chat = await Chat.findOne({
      participants: { $all: participants },
    }).populate("participants", "name username email");

    // Create new chat if it doesn't exist
    if (!chat) {
      chat = new Chat({
        participants: participants,
        messages: [],
      });
      await chat.save();
      await chat.populate("participants", "name username email");
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error in getOrCreateChat:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all chats for the current user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "name username email")
      .sort({ lastMessage: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error in getUserChats:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get chat by ID
exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    })
      .populate("participants", "name username email")
      .populate("messages.sender", "name username");

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error in getChatById:", error);
    res.status(500).json({ error: error.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Message content is required" });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const newMessage = {
      sender: userId,
      content: content.trim(),
      timestamp: new Date(),
    };

    chat.messages.push(newMessage);
    chat.lastMessage = new Date();
    await chat.save();

    // Populate the sender information for the response
    await chat.populate("messages.sender", "name username");

    // Get the last message (the one we just added)
    const sentMessage = chat.messages[chat.messages.length - 1];

    res.status(200).json(sentMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: error.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Mark all messages from other participants as read
    chat.messages.forEach((message) => {
      if (message.sender.toString() !== userId.toString()) {
        message.isRead = true;
      }
    });

    await chat.save();
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error in markAsRead:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a chat
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOneAndDelete({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error in deleteChat:", error);
    res.status(500).json({ error: error.message });
  }
};
