import express from "express";
import { doctorDashboard } from "../controllers/doctorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/dashboard", protect, doctorDashboard);

export default router;
