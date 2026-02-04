import PatientProfile from "../models/PatientProfile.js";
import DoctorProfile from "../models/DoctorProfile.js";
import User from "../models/User.js";

export const createPatientProfile = async (req, res) => {
  const profile = await PatientProfile.create({
    userId: req.userId,
    ...req.body,
  });

  await User.findByIdAndUpdate(req.userId, {
    profileCompleted: true,
  });

  res.json({ message: "Patient profile created" });
};

export const createDoctorProfile = async (req, res) => {
  const profile = await DoctorProfile.create({
    userId: req.userId,
    ...req.body,
  });

  await User.findByIdAndUpdate(req.userId, {
    profileCompleted: true,
  });

  res.json({ message: "Doctor profile created" });
};
