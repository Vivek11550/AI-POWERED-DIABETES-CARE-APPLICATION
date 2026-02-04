import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: String,
  specialization: String,
  qualification: String,
  registrationNumber: String,
  hospitalName: String,
  experienceYears: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("DoctorProfile", doctorProfileSchema);
