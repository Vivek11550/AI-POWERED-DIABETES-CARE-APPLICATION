import HealthAssessment from "../models/HealthAssessment.js";
import User from "../models/User.js";

// Summary + High Risk
export const doctorDashboard = async (req, res) => {
  const assessments = await HealthAssessment.aggregate([
    { $sort: { createdAt: -1 } }, // newest first
    {
      $group: {
        _id: "$userId",
        latestAssessment: { $first: "$$ROOT" }
      }
    },
    {
      $replaceRoot: { newRoot: "$latestAssessment" }
    }
  ]);

  const populatedAssessments = await HealthAssessment.populate(assessments, {
    path: "userId",
  });

  const summary = {
    level1: populatedAssessments.filter(a => a.riskLevel === "Level 1").length,
    level2: populatedAssessments.filter(a => a.riskLevel === "Level 2").length,
    level3: populatedAssessments.filter(a => a.riskLevel === "Level 3").length,
  };

  const highRisk = populatedAssessments.filter(a => a.riskLevel === "Level 3");
  const medRisk = populatedAssessments.filter(a => a.riskLevel === "Level 2");
  const lowRisk = populatedAssessments.filter(a => a.riskLevel === "Level 1");

  res.json({
    summary,
    highRisk,
    medRisk,
    lowRisk
  });
};
export const changePassword = async (req, res) => {
  try {
    const { email, previousPassword, newPassword } = req.body;

    if (!email || !previousPassword || !newPassword) {
      return res.status(400).json({
        message: "Email, previous password, and new password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      previousPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Previous password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from the previous password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



