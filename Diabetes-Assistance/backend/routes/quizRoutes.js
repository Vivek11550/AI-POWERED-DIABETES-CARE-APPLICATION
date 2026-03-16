import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  submitQuiz,
  getMyQuizResults,
  getQuizComparison
} from "../controllers/quizController.js";

const router = express.Router();

// submit quiz
router.post("/submit", protect, submitQuiz);

// get all user quiz results
router.get("/my-results", protect, getMyQuizResults);

// get comparison (first vs latest)
router.get("/comparison", protect, getQuizComparison);

export default router;