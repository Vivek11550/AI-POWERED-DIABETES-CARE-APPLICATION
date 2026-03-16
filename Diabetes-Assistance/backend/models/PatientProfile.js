import mongoose from "mongoose";

const patientProfileSchema = new mongoose.Schema({
 userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  unique: true
},

  fullName: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    enum: ["male", "female"],
  },

  heightCm: Number,

  baselineWeightKg: Number,

  education: {
    type: String,
   enum: ["illiterate", "primary", "secondary", "higher_secondary", "graduation+"],
  },

  occupation: {
    type: String,
    enum: ["private", "government", "farmer", "housewife"],
  },

  diet: {
    type: String,
    enum: ["veg", "nonveg"],
  },

  diabetesType: String,

  diabetesDurationYears: Number,

  phone: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("PatientProfile", patientProfileSchema);