import HealthAssessment from "../models/HealthAssessment.js";
import PatientProfile from "../models/PatientProfile.js";

// Summary + High Risk
export const doctorDashboard = async (req, res) => {
  const assessments = await HealthAssessment.find().populate("userId");

  const summary = {
    level1: assessments.filter(a => a.riskLevel === "Level 1").length,
    level2: assessments.filter(a => a.riskLevel === "Level 2").length,
    level3: assessments.filter(a => a.riskLevel === "Level 3").length,
  };

  const highRisk = assessments.filter(a => a.riskLevel === "Level 3");

  res.json({ summary, highRisk });
};
