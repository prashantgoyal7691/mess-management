import express from "express";
import {
  setDailyExpense,
  getExpenseHistory,
  runLockNow,
  generateMonthlyInvoices,
  getMyInvoices,
  getMonthlySummary,
  downloadInvoice,
} from "../controllers/billingController.js";

import { adminAuth, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/set-expense", adminAuth, setDailyExpense);
router.get("/expense-history", adminAuth, getExpenseHistory);
router.post("/run-lock", adminAuth, runLockNow);
router.post("/generate-monthly-invoices", adminAuth, generateMonthlyInvoices);

router.get("/monthly-summary", authMiddleware, getMonthlySummary);
router.get("/my-invoices", authMiddleware, getMyInvoices);
router.get("/invoice/:month",authMiddleware,downloadInvoice);

export default router;
