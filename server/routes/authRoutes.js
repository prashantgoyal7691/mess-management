import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  signup,
  verifyOTP,
  login,
  forgotPassword,
  resetPassword,
  getStudentProfile,
  withdrawPendingRequest,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", authMiddleware, getStudentProfile);
router.post("/withdraw-pending", withdrawPendingRequest);

export default router;