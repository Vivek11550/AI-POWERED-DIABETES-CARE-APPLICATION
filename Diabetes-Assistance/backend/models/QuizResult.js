import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  score: Number,

  totalQuestions: Number,

  type: {
    type: String,
    enum: ["initial", "followup"]
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("QuizResult", quizResultSchema);