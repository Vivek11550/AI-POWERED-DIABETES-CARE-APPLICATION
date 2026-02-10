import express from "express";
import { createAssessment,getLatestAssessment } from "../controllers/assessmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAssessment);
router.get("/latest", protect, getLatestAssessment);

export default router;
