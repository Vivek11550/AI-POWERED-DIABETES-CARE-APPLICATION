import express from "express";
import {
  exportPatients,
  exportAssessments,
} from "../controllers/exportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { exportQuizComparison } from "../controllers/exportController.js";

const router = express.Router();

router.get("/patients",protect, exportPatients);
router.get("/assessments", protect, exportAssessments);
router.get("/quiz-comparison", protect, exportQuizComparison);

export default router;