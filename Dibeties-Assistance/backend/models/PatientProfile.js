import mongoose from "mongoose";

const patientProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: String,
  age: Number,
  gender: String,
  heightCm: Number,
  baselineWeightKg: Number,
  dietPreference: String,
  diabetesType: String,
  diabetesDurationYears: Number,
  phone: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PatientProfile", patientProfileSchema);
