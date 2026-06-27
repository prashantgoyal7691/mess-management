import express from "express";
import { getServerDate } from "../controllers/systemController.js";

const router = express.Router();

router.get("/date", getServerDate);

export default router;