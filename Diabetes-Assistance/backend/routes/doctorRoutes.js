import express from "express";
import { changePassword, doctorDashboard, getPatientsWithAssessments } from "../controllers/doctorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/dashboard", protect, doctorDashboard);
router.post("/changePassword", protect, changePassword);
router.get("/patients-assessments", protect, getPatientsWithAssessments);

export default router;
