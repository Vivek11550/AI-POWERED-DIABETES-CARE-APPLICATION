import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

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
  const message = await Message.create({
    chatId: req.params.chatId,
    senderRole: req.body.senderRole,
    senderId: req.userId,
    message: req.body.message,
  });

  res.json(message);
};
