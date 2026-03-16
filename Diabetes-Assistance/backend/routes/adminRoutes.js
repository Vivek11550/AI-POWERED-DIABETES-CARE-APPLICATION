import express from "express";
import {getAllDoctors, getAllPatients } from "../controllers/adminController.js";

const router = express.Router();
router.get("/doctors", getAllDoctors);
router.get("/patients", getAllPatients);


export default router;
