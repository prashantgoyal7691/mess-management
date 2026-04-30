import express from "express";
import {
  setDailyExpense,
  generateBills,
  getMyDynamicBills,
  getExpenseHistory,
  runLockNow,
} from "../controllers/billingController.js";

import { adminAuth ,authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/set-expense", adminAuth, setDailyExpense);
router.post("/generate", adminAuth, generateBills);
router.get("/my-dynamic", authMiddleware, getMyDynamicBills);
router.get("/expense-history", adminAuth, getExpenseHistory);
router.post("/run-lock", adminAuth, runLockNow);

export default router;