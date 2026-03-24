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
    enum: ['Male', 'Female', 'Other'],
  },

  heightCm: Number,

  baselineWeightKg: Number,

  education: {
    type: String,
   enum: ['Illiterate', 'Primary', 'Secondary', 'Higher Sec', 'Graduation+'],
  },

  occupation: {
    type: String,
    enum: ['Private', 'Government', 'Farmer', 'Housewife', 'Student'],
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