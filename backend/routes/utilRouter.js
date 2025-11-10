const express = require("express");
const router = express.Router();
const {
  getAllSkills,
  showProfileWithUsername,
  verifyToken,
} = require("../controllers/utilController");
const {
  aiChat,
  clearConversation,
} = require("../controllers/aiChatController");
const { authCheck } = require("../middlewares/authCheck");

router.get("/skills", getAllSkills);

router.get("/verifytoken", authCheck, verifyToken);

// AI Chatbot routes
router.post("/ai-chat", aiChat);
router.post("/ai-chat/clear", clearConversation);

router.get("/:id", showProfileWithUsername);

module.exports = router;
