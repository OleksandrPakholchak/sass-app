const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createConversation,
  getConversations,
} = require("../controllers/conversationController");

router.post("/", createConversation);
router.get("/", authMiddleware, getConversations);

module.exports = router;
