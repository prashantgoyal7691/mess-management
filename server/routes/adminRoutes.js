import express from "express";
import { adminLogin, getMealCount } from "../controllers/adminController.js";
import {
  sendAdminOtp,
  verifyAdminOtpAndSignup,
} from "../controllers/adminController.js";
import { adminAuth ,authMiddleware} from "../middleware/authMiddleware.js";
import {
  getStudentsByAdmin,
  getAdminProfile,
  getTodayReport,
  getStudentHistory,
  getMesses,
  downloadStudentHistoryPDF,
  setMenu,
  getMenu,
  getMenuForStudent,
  approveStudent,
  rejectStudent,
  deleteStudent,
  adminForgotPassword,adminResetPassword,
  updateManagementFee,
  getWeeklyMenuForStudent,
} from "../controllers/adminController.js";


const router = express.Router();

router.post("/send-otp", sendAdminOtp);
router.post("/verify-otp", verifyAdminOtpAndSignup);
router.post("/login", adminLogin);
router.get("/students", adminAuth, getStudentsByAdmin);
router.post("/forgot-password", adminForgotPassword);
router.post("/reset-password", adminResetPassword);
router.put("/approve-student/:studentId", adminAuth, approveStudent);
router.delete("/reject-student/:studentId", adminAuth, rejectStudent);
router.delete("/delete-student/:studentId", adminAuth, deleteStudent);
router.get("/report/today", adminAuth, getTodayReport);
router.get("/student-history/:studentId", adminAuth, getStudentHistory);
router.get(
  "/student-history-pdf/:studentId",
  adminAuth,
  downloadStudentHistoryPDF,
);
router.get("/messes", getMesses);
router.post("/menu", adminAuth, setMenu);
router.get("/menu", adminAuth, getMenu);
router.get("/menu/student", authMiddleware, getMenuForStudent);
router.get("/menu/student/week", authMiddleware,getWeeklyMenuForStudent);
router.get("/meal-count", adminAuth, getMealCount);
router.get("/profile", adminAuth, getAdminProfile);
router.put(
  "/management-fee",
  adminAuth,
  updateManagementFee
);

export default router;
