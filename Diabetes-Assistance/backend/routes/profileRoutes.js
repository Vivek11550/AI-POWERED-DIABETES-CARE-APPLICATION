import express from "express";
import {
  createPatientProfile,
  createDoctorProfile,
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import PatientProfile from "../models/PatientProfile.js";
import DoctorProfile from "../models/DoctorProfile.js";

const router = express.Router();

/* ---------------- CREATE PROFILES ---------------- */

// Create patient profile (first time)
router.post("/patient", protect, createPatientProfile);

// Create doctor profile (first time)
router.post("/doctor", protect, createDoctorProfile);

/* ---------------- GET PROFILES ---------------- */

// 🔴 REQUIRED FOR CHAT (Doctor fetching patient name)
router.get("/patient/:id", protect, async (req, res) => {
  try {
    const profile = await PatientProfile.findOne({
      userId: req.params.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Patient profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching patient profile",
    });
  }
});

// 🔹 GET doctor profile by userId
router.get("/doctor/:id", protect, async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({
      userId: req.params.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching doctor profile",
    });
  }
});

export default router;
