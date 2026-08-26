import express from "express";

import {
  createProfileUpdateRequest,
} from "../controllers/profileUpdateController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/profile-update",
  authMiddleware,
  createProfileUpdateRequest,
);

export default router;