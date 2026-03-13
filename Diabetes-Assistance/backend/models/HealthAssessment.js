import mongoose from "mongoose";

const healthAssessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    weightKg: {
      type: Number,
      required: true,
      min: 1,
    },

    bmi: {
      type: Number,
      required: true,
      min: 1,
    },

    fastingSugar: {
      type: Number,
      required: true,
      min: 0,
    },

    postPrandialSugar: {
      type: Number,
      required: true,
      min: 0,
    },

    hba1c: {
      type: Number,
      required: true,
      min: 0,
    },

    footUlcer: {
      type: Boolean,
      default: false,
    },

    neuropathy: {
      type: Boolean,
      default: false,
    },

    urineGlucose: {
      type: String,
      enum: ["+", "++", "+++", "++++"],
      default: "+",
    },

    urineKetone: {
      type: String,
      enum: ["+", "++", "+++", "++++"],
      default: "+",
    },

    preDiabetesPresent: {
      type: Boolean,
      default: false,
    },

    preDiabetesDuration: {
      type: String,
      enum: ["<1yr", "1-5yr", "6-10yr", ">10yr"],
      required: function () {
        return this.preDiabetesPresent === true;
      },
    },

    diabetesPresent: {
      type: Boolean,
      default: false,
    },

    diabetesDuration: {
      type: String,
      enum: ["<1yr", "1-5yr", "6-10yr", ">10yr"],
      required: function () {
        return this.diabetesPresent === true;
      },
    },

    riskLevel: {
      type: String,
      enum: ["Level 1", "Level 2", "Level 3"],
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

export default mongoose.model("HealthAssessment", healthAssessmentSchema);
