import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["patient", "doctor"] },
  profileCompleted: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
