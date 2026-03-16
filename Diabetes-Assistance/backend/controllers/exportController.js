import PatientProfile from "../models/PatientProfile.js";
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
      "dietPreference",
      "diabetesType",
      "diabetesDurationYears",
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