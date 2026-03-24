import PatientProfile from "../models/PatientProfile.js";
import QuizResult from "../models/QuizResult.js";
import HealthAssessment from "../models/HealthAssessment.js";
import { Parser } from "json2csv";

/* ============================
   EXPORT PATIENT DETAILS
============================ */

export const exportPatients = async (req, res) => {
  try {
    const patients = await PatientProfile.find();

    const fields = [
      "fullName",
      "age",
      "gender",
      "phone",
      "heightCm",
      "baselineWeightKg",
      "diet",
      "diabetesType",
      "diabetesDurationYears",
      "education",
      "occupation",
      "createdAt",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(patients);

    res.header("Content-Type", "text/csv");
    res.attachment("patients.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================
   EXPORT PATIENT ASSESSMENTS
============================ */

export const exportAssessments = async (req, res) => {
  try {

    const assessments = await HealthAssessment.find()
      .populate("userId", "email") // get email from User model
      .sort({ createdAt: -1 });

    const formatted = await Promise.all(
      assessments.map(async (a) => {

        const patient = await PatientProfile.findOne({
          userId: a.userId?._id,
        });

        return {
          patientName: patient?.fullName || "",
          email: a.userId?.email || "",
          phone: patient?.phone || "",
          age: patient?.age || "",
          gender: patient?.gender || "",
          diabetesType: patient?.diabetesType || "",

          weightKg: a.weightKg,
          bmi: a.bmi,
          fastingSugar: a.fastingSugar,
          postPrandialSugar: a.postPrandialSugar,
          hba1c: a.hba1c,

          footUlcer: a.footUlcer,
          neuropathy: a.neuropathy,

          urineGlucose: a.urineGlucose,
          urineKetone: a.urineKetone,

          preDiabetesPresent: a.preDiabetesPresent,
          preDiabetesDuration: a.preDiabetesDuration,

          diabetesPresent: a.diabetesPresent,
          diabetesDuration: a.diabetesDuration,

          riskLevel: a.riskLevel,
          assessmentDate: a.createdAt,
        };
      })
    );

    const parser = new Parser();
    const csv = parser.parse(formatted);

    res.header("Content-Type", "text/csv");
    res.attachment("patient_assessments.csv");

    return res.send(csv);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


/* ============================
   EXPORT QUIZ ASSESSMENTS
============================ */

export const exportQuizComparison = async (req, res) => {
  try {

    // 1️⃣ Fetch all quiz results (latest first)
    const results = await QuizResult.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    // 2️⃣ Group results by user
    const grouped = {};

    for (let r of results) {
      const userId = r.userId?._id?.toString();
      if (!userId) continue;

      if (!grouped[userId]) {
        grouped[userId] = [];
      }

      grouped[userId].push(r);
    }

    // 3️⃣ Build final dataset
    const finalData = [];

    for (let userId in grouped) {
      const quizzes = grouped[userId];

      const latest = quizzes[0];
      const previous = quizzes[1]; // may be undefined

      // fetch patient profile
      const patient = await PatientProfile.findOne({ userId });

      // calculate change + status
      let scoreChange = "N/A";
      let status = "No previous data";

      if (previous) {
        const change = latest.score - previous.score;
        scoreChange = change;

        if (change > 0) status = "Improved";
        else if (change < 0) status = "Declined";
        else status = "No change";
      }

      finalData.push({
        patientName: patient?.fullName || "",
        email: latest.userId?.email || "",
        phone: patient?.phone || "",
        age: patient?.age || "",
        gender: patient?.gender || "",

        previousScore: previous ? previous.score : "N/A",
        latestScore: latest.score,
        scoreChange: scoreChange,
        status: status,

        previousDate: previous ? previous.createdAt : "N/A",
        latestDate: latest.createdAt,
      });
    }

    // 4️⃣ Convert to CSV
    const fields = [
      "patientName",
      "email",
      "phone",
      "age",
      "gender",
      "previousScore",
      "latestScore",
      "scoreChange",
      "status",
      "previousDate",
      "latestDate",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(finalData);

    // 5️⃣ Send as downloadable file
    res.header("Content-Type", "text/csv");
    res.attachment("quiz_comparison.csv");

    return res.send(csv);

  } catch (error) {
    console.error("Export Quiz Comparison Error:", error);
    res.status(500).json({ message: error.message });
  }
};