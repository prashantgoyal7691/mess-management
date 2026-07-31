import express from "express";
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaint,
} from "../controllers/complaintController.js";

import { authMiddleware ,adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student
router.post("/create", authMiddleware, createComplaint);
router.get("/my", authMiddleware, getMyComplaints);

// Admin
router.get("/admin", adminAuth, getAllComplaints);
router.patch("/:id", adminAuth, updateComplaint);

export default router;