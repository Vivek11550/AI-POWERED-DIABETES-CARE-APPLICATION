import HealthAssessment from "../models/HealthAssessment.js";

export const createAssessment = async (req, res) => {
  const {
    weightKg,
    bmi,
    fastingSugar,
    postPrandialSugar,
    hba1c,
    footUlcer,
    neuropathy,
  } = req.body;

  let riskLevel = "Level 1";

  if (
    hba1c > 9 ||
    fastingSugar > 180 ||
    postPrandialSugar > 250 ||
    footUlcer
  ) {
    riskLevel = "Level 3";
  } else if (
    hba1c >= 7 ||
    fastingSugar >= 130 ||
    postPrandialSugar >= 180
  ) {
    riskLevel = "Level 2";
  }

  const assessment = await HealthAssessment.create({
    userId: req.userId,
    weightKg,
    bmi,
    fastingSugar,
    postPrandialSugar,
    hba1c,
    footUlcer,
    neuropathy,
    riskLevel,
  });

  res.json({
    riskLevel,
    assessmentId: assessment._id,
  });
};
