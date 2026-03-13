import HealthAssessment from "../models/HealthAssessment.js";

export const createAssessment = async (req, res) => {
  try {
    let {
      weightKg,
      bmi,
      fastingSugar,
      postPrandialSugar,
      hba1c,
      footUlcer,
      neuropathy,
      urineGlucose,
      urineKetone,
      preDiabetesPresent,
      preDiabetesDuration,
      diabetesPresent,
      diabetesDuration,
    } = req.body;

    // ===============================
    // 🔹 TYPE NORMALIZATION
    // ===============================

    weightKg = Number(weightKg);
    bmi = Number(bmi);
    fastingSugar = Number(fastingSugar);
    postPrandialSugar = Number(postPrandialSugar);
    hba1c = Number(hba1c);

    footUlcer = Boolean(footUlcer);
    neuropathy = Boolean(neuropathy);
    preDiabetesPresent = Boolean(preDiabetesPresent);
    diabetesPresent = Boolean(diabetesPresent);

    // ===============================
    // 🔹 SANITIZE CONDITIONAL FIELDS
    // ===============================

    if (!preDiabetesPresent) {
      preDiabetesDuration = undefined;
    }

    if (!diabetesPresent) {
      diabetesDuration = undefined;
    }

    // ===============================
    // 🔹 BASIC BACKEND VALIDATION
    // ===============================

    if (
      !weightKg ||
      !bmi ||
      !fastingSugar ||
      !postPrandialSugar ||
      !hba1c
    ) {
      return res.status(400).json({
        message: "Missing required medical values",
      });
    }

    // ===============================
    // 🔹 URINE SEVERITY MAPPING
    // ===============================

    const severityMap = {
      "+": 1,
      "++": 2,
      "+++": 3,
      "++++": 4,
    };

    const urineGlucoseScore = severityMap[urineGlucose] || 0;
    const urineKetoneScore = severityMap[urineKetone] || 0;

    // ===============================
    // 🔹 RULE-BASED RISK ENGINE
    // ===============================

    let riskLevel = "Level 1";

    // 🔴 LEVEL 3 (High Risk)
    if (
      hba1c > 9 ||
      fastingSugar > 180 ||
      postPrandialSugar > 250 ||
      footUlcer ||
      neuropathy ||
      urineGlucoseScore >= 3 ||
      urineKetoneScore >= 3 ||
      (diabetesPresent && diabetesDuration === ">10yr")
    ) {
      riskLevel = "Level 3";
    }

    // 🟡 LEVEL 2 (Moderate Risk)
    else if (
      hba1c >= 7 ||
      fastingSugar >= 130 ||
      postPrandialSugar >= 180 ||
      urineGlucoseScore === 2 ||
      urineKetoneScore === 2 ||
      preDiabetesPresent ||
      (diabetesPresent &&
        ["1-5yr", "6-10yr"].includes(diabetesDuration))
    ) {
      riskLevel = "Level 2";
    }

    // ===============================
    // 🔹 SAVE TO DATABASE
    // ===============================

    const assessment = await HealthAssessment.create({
      userId: req.userId,
      weightKg,
      bmi,
      fastingSugar,
      postPrandialSugar,
      hba1c,
      footUlcer,
      neuropathy,
      urineGlucose,
      urineKetone,
      preDiabetesPresent,
      preDiabetesDuration,
      diabetesPresent,
      diabetesDuration,
      riskLevel,
    });

    return res.status(201).json({
      success: true,
      riskLevel,
      assessmentId: assessment._id,
    });
  } catch (error) {
    console.error("Assessment Error:", error);
    return res.status(500).json({
      message: "Server error while creating assessment",
    });
  }
};

export const getLatestAssessment = async (req, res) => {
  const assessment = await HealthAssessment.findOne({
    userId: req.userId,
  }).sort({ createdAt: -1 });

  if (!assessment) {
    return res.status(404).json({
      message: "No assessment found",
    });
  }

  res.json(assessment);
};
