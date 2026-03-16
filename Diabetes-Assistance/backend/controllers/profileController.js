import PatientProfile from "../models/PatientProfile.js";
import DoctorProfile from "../models/DoctorProfile.js";
import User from "../models/User.js";

/* ================= CREATE PATIENT PROFILE ================= */

export const createPatientProfile = async (req, res) => {
  try {

    // check if profile already exists
    const existingProfile = await PatientProfile.findOne({
      userId: req.userId,
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Patient profile already exists",
      });
    }

    const profile = await PatientProfile.create({
      userId: req.userId,
      ...req.body,
    });

    await User.findByIdAndUpdate(req.userId, {
      profileCompleted: true,
    });

    res.json({
      message: "Patient profile created",
      profile,
    });

  } catch (error) {

    console.log("Error creating patient profile:", error);

    res.status(500).json({
      message: "Server error creating patient profile",
    });

  }
};


/* ================= CREATE DOCTOR PROFILE ================= */

export const createDoctorProfile = async (req, res) => {
  try {

    const existingProfile = await DoctorProfile.findOne({
      userId: req.userId,
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Doctor profile already exists",
      });
    }

    const profile = await DoctorProfile.create({
      userId: req.userId,
      ...req.body,
    });

    await User.findByIdAndUpdate(req.userId, {
      profileCompleted: true,
    });

    res.json({
      message: "Doctor profile created",
      profile,
    });

  } catch (error) {

    console.log("Error creating doctor profile:", error);

    res.status(500).json({
      message: "Server error creating doctor profile",
    });

  }
};