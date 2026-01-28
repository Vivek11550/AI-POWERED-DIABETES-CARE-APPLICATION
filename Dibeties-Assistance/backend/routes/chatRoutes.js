import express from "express";
import {
  startChat,
  getMessages,
  sendMessage,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import Chat from "../models/Chat.js"; // ✅ FIX (MISSING IMPORT)

const router = express.Router();

router.post("/start", protect, startChat);

router.get("/:chatId/messages", protect, getMessages);

router.post("/:chatId/message", protect, sendMessage);

// ✅ Patient fetches existing chat
router.get("/patient", protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      patientId: req.userId,
    });

    if (!chat) {
      return res.status(404).json({
        message: "No chat found",
      });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching chat",
    });
  }
});

export default router;
