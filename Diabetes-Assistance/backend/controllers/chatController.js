import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import fs from "fs";

export const startChat = async (req, res) => {
  const { patientId } = req.body;

  let chat = await Chat.findOne({
    doctorId: req.userId,
    patientId,
  });

  if (!chat) {
    chat = await Chat.create({
      doctorId: req.userId,
      patientId,
    });
  }

  res.json(chat);
};

export const getMessages = async (req, res) => {
  const messages = await Message.find({ chatId: req.params.chatId });
  res.json(messages);
};

export const sendMessage = async (req, res) => {
  try {
    const imageUrl = req.file
      ? `/uploads/chat/${req.file.filename}`
      : null;

    const message = await Message.create({
      chatId: req.params.chatId,
      senderRole: req.body.senderRole,
      senderId: req.userId,
      message: req.body.message,
      imageUrl,
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({
      message: "Error sending message",
      error: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== req.userId) {
      return res.status(403).json({
        message: "You can delete only your messages",
      });
    }

    if (message.imageUrl) {
      const path = "." + message.imageUrl;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }

    await message.deleteOne();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};