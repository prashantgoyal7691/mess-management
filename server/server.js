import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import { generateInvoicesForPreviousMonth } from "./jobs/invoiceGenerator.js";
import cron from "node-cron";
import { lockOldMeals } from "./jobs/lockMeals.js";
import systemRoutes from "./routes/systemRoutes.js";


dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mess-management-navy.vercel.app",
      "http://mess-management.s3-website.ap-south-1.amazonaws.com",
    ],
    credentials: true,
  })
);

app.use(express.json());


// routes
app.use("/api/system", systemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/meal", mealPlanRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/billing", billingRoutes);


app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

// 🔐 Protected Test Route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

cron.schedule("*/5 * * * *", async () => {
  console.log("Running meal lock job...");
  try {
    await lockOldMeals();
  } catch (err) {
    console.error("Meal lock job failed:", err);
  }
});

cron.schedule("* * * * *", async () => {
  console.log("Running invoice reconciliation job...");
  try {
    await generateInvoicesForPreviousMonth();
  } catch (err) {
    console.error("Invoice reconciliation job failed:", err);
  }
});

// DB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});