import express from "express";
import {
  createPatientProfile,
  createDoctorProfile,
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import PatientProfile from "../models/PatientProfile.js";
import DoctorProfile from "../models/DoctorProfile.js";

const router = express.Router();

/* ================= CREATE PROFILES ================= */
// Create patient profile (first time)
router.post("/patient", protect, createPatientProfile);
// Create doctor profile (first time)
router.post("/doctor", protect, createDoctorProfile);



/* ================= GET MY PROFILE ================= */
// ✅ Patient: get own profile

router.get("/patient/me", protect, async (req, res) => {
  try {

    const profile = await PatientProfile.findOne({
      userId: req.userId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Patient profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    console.log("Error fetching patient profile:", error);

    res.status(500).json({
      message: "Server error while fetching patient profile",
    });
  }
});


// ✅ Doctor: get own profile
router.get("/doctor/me", protect, async (req, res) => {
  const profile = await DoctorProfile.findOne({
    userId: req.userId,
  });

  if (!profile) {
    return res.status(404).json({
      message: "Doctor profile not found",
    });
  }

  res.json(profile);
});


/* ================= UPDATE MY PROFILE ================= */
// ✅ Patient: update profile
router.put("/patient", protect, async (req, res) => {
  const updated = await PatientProfile.findOneAndUpdate(
    { userId: req.userId },
    req.body,
    { new: true }
  );

  res.json(updated);
});

// ✅ Doctor: update profile
router.put("/doctor", protect, async (req, res) => {
  const updated = await DoctorProfile.findOneAndUpdate(
    { userId: req.userId },
    req.body,
    { new: true }
  );

  res.json(updated);
});



/* ================= GET PROFILE BY ID (CHAT) ================= */

// 🔴 For doctor chat header
router.get("/patient/:id", protect, async (req, res) => {
  const profile = await PatientProfile.findOne({
    userId: req.params.id,
  });

  if (!profile) {
    return res.status(404).json({
      message: "Patient profile not found",
    });
  }

  res.json(profile);
});

// 🔴 For patient chat header
router.get("/doctor/:id", protect, async (req, res) => {
  const profile = await DoctorProfile.findOne({
    userId: req.params.id,
  });

  if (!profile) {
    return res.status(404).json({
      message: "Doctor profile not found",
    });
  }

  res.json(profile);
});

export default router;
