import express from "express";

import {
  setMealPlan,
  getMyMealPlan,
  getMonthlyAttendance,
} from "../controllers/mealPlanController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/set",
  authMiddleware,
  setMealPlan,
);

router.get(
  "/my",
  authMiddleware,
  getMyMealPlan,
);

router.get(
  "/monthly",
  authMiddleware,
  getMonthlyAttendance,
);

export default router;