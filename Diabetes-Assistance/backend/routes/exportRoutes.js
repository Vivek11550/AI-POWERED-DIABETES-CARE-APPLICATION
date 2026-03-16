import express from "express";
import {
  exportPatients,
  exportAssessments,
} from "../controllers/exportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/patients",protect, exportPatients);
router.get("/assessments", protect, exportAssessments);

export default router;