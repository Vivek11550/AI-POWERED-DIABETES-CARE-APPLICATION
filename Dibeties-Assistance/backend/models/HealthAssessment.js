import mongoose from "mongoose";

const healthAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  weightKg: Number,
  bmi: Number,
  fastingSugar: Number,
  postPrandialSugar: Number,
  hba1c: Number,

  footUlcer: Boolean,
  neuropathy: Boolean,

  riskLevel: {
    type: String,
    enum: ["Level 1", "Level 2", "Level 3"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("HealthAssessment", healthAssessmentSchema);
