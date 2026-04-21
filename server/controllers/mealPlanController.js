import MealPlan from "../models/MealPlan.js";
import User from "../models/User.js";

// ✅ Correct lock logic (same as frontend)
const isLocked = (date) => {
  const today = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
);
  const mealDate = new Date(date + "T00:00:00");

  today.setHours(0, 0, 0, 0);
  mealDate.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return mealDate <= tomorrow;
};

// ✅ SET PLAN
export const setMealPlan = async (req, res) => {
  try {
    const { userId, date, meal, status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Use correct lock logic
    if (isLocked(date)) {
      return res.status(400).json({
        message: "Meal is locked for this date",
      });
    }

    const meals = ["breakfast", "lunch", "dinner"];

    for (const m of meals) {
      const existing = await MealPlan.findOne({ userId, date, meal: m });

      const finalStatus =
        m === meal ? status : existing?.status || "skip";

      await MealPlan.findOneAndUpdate(
        { userId, date, meal: m },
        {
          status: finalStatus,
          messId: user?.messId,
        },
        { upsert: true, returnDocument: "after" }
      );
    }

    res.json({ message: "Meal plan updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating meal plan" });
  }
};

// ✅ GET PLAN
export const getMyMealPlan = async (req, res) => {
  try {
    const { userId } = req.query;

    const plans = await MealPlan.find({ userId });

    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: "Error fetching plans" });
  }
};

// ✅ MONTHLY ATTENDANCE
export const getMonthlyAttendance = async (req, res) => {
  try {
    const { userId, month } = req.query;

    const plans = await MealPlan.find({
      userId,
      date: { $regex: `^${month}` },
    });

    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance" });
  }
};