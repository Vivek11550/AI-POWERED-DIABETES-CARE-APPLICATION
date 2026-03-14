import express from "express";
import { changePassword, doctorDashboard } from "../controllers/doctorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/dashboard", protect, doctorDashboard);
router.post("/changePassword", protect, changePassword);


export default router;
