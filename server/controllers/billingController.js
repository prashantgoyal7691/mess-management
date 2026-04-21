import DailyExpense from "../models/DailyExpense.js";
import MealPlan from "../models/MealPlan.js";
import StudentBill from "../models/StudentBill.js";
import User from "../models/User.js";

// ADMIN SET EXPENSE
export const setDailyExpense = async (req, res) => {
  try {
    const adminId = req.user.id;

    const { breakfastCost, lunchCost, dinnerCost } = req.body;

    const tomorrowObj = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    tomorrowObj.setDate(tomorrowObj.getDate() + 1);

    const date = new Date(
      tomorrowObj.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    ).toLocaleDateString("en-CA");

    const expense = await DailyExpense.findOneAndUpdate(
      { messId: adminId, date },
      { breakfastCost, lunchCost, dinnerCost },
      { new: true, upsert: true },
    );

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Error saving expense" });
  }
};

// GENERATE BILL (RUN AFTER DAY ENDS)
export const generateBills = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { date } = req.body;

    const expense = await DailyExpense.findOne({
      messId: adminId,
      date,
    });

    if (!expense) {
      return res.status(404).json({ message: "No expense found" });
    }

    // Delete old bills
    await StudentBill.deleteMany({ messId: adminId, date });

    // 🔥 Fetch only this mess data
    const meals = await MealPlan.find({
      date,
      locked: true,
      messId: adminId,
    });

    if (!meals.length) {
      return res.json({ message: "No meals found", bills: [] });
    }
    // Count per meal
    let breakfastCount = 0;
    let lunchCount = 0;
    let dinnerCount = 0;

    meals.forEach((m) => {
      if (m.status !== "eat") return;

      if (m.meal === "breakfast") breakfastCount++;
      if (m.meal === "lunch") lunchCount++;
      if (m.meal === "dinner") dinnerCount++;
    });

    // Calculate rates
    const breakfastRate =
      breakfastCount > 0
        ? parseFloat((expense.breakfastCost / breakfastCount).toFixed(2))
        : 0;

    const lunchRate =
      lunchCount > 0
        ? parseFloat((expense.lunchCost / lunchCount).toFixed(2))
        : 0;

    const dinnerRate =
      dinnerCount > 0
        ? parseFloat((expense.dinnerCost / dinnerCount).toFixed(2))
        : 0;

    // Group by user
    const userBills = {};

    meals.forEach((m) => {
      if (m.status !== "eat") return;

      const uid = m.userId.toString(); // 🔥 FIX

      if (!userBills[uid]) {
        userBills[uid] = {
          breakfast: 0,
          lunch: 0,
          dinner: 0,
        };
      }

      if (m.meal === "breakfast") {
        userBills[uid].breakfast = breakfastRate;
      }
      if (m.meal === "lunch") {
        userBills[uid].lunch = lunchRate;
      }
      if (m.meal === "dinner") {
        userBills[uid].dinner = dinnerRate;
      }
    });

    // Save
    const billsToInsert = [];

    for (const userId in userBills) {
      const data = userBills[userId];

      const total = parseFloat(
        (data.breakfast + data.lunch + data.dinner).toFixed(2),
      );

      billsToInsert.push({
        userId,
        messId: adminId,
        date,
        ...data,
        total,
      });
    }

    const bills = await StudentBill.insertMany(billsToInsert);

    res.json({ message: "Bills generated", bills });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error generating bills" });
  }
};

export const getMyDynamicBills = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = user._id;
    const messId = user.messId;

    // 🔥 Fetch only relevant data
    const myMeals = await MealPlan.find({
      userId,
      status: "eat",
      locked: true,
      messId,
    });

    const result = [];

    // 🔥 GROUP BY DATE (IMPORTANT FIX)
    const grouped = {};

    myMeals.forEach((m) => {
      if (!grouped[m.date]) grouped[m.date] = [];
      grouped[m.date].push(m);
    });

    // 🔥 LOOP PER DATE
    for (const date in grouped) {
      const expense = await DailyExpense.findOne({
        date,
        messId,
      });

      if (!expense) continue;

      let breakfast = 0;
      let lunch = 0;
      let dinner = 0;

      // Get counts for that date (only once per meal)
      const breakfastCount = await MealPlan.countDocuments({
        date,
        meal: "breakfast",
        status: "eat",
        locked: true,
        messId,
      });

      const lunchCount = await MealPlan.countDocuments({
        date,
        meal: "lunch",
        status: "eat",
        locked: true,
        messId,
      });

      const dinnerCount = await MealPlan.countDocuments({
        date,
        meal: "dinner",
        status: "eat",
        locked: true,
        messId,
      });

      // Calculate rates
      const breakfastRate =
        breakfastCount > 0
          ? parseFloat((expense.breakfastCost / breakfastCount).toFixed(2))
          : 0;

      const lunchRate =
        lunchCount > 0
          ? parseFloat((expense.lunchCost / lunchCount).toFixed(2))
          : 0;

      const dinnerRate =
        dinnerCount > 0
          ? parseFloat((expense.dinnerCost / dinnerCount).toFixed(2))
          : 0;

      // Assign only if student ate
      const mealsSet = new Set(grouped[date].map((m) => m.meal));

      if (mealsSet.has("breakfast")) breakfast = breakfastRate;
      if (mealsSet.has("lunch")) lunch = lunchRate;
      if (mealsSet.has("dinner")) dinner = dinnerRate;

      const total = parseFloat((breakfast + lunch + dinner).toFixed(2));

      result.push({
        date,
        breakfast: parseFloat(breakfast.toFixed(2)),
        lunch: parseFloat(lunch.toFixed(2)),
        dinner: parseFloat(dinner.toFixed(2)),
        total,
      });
    }

    result.sort((a, b) => a.date.localeCompare(b.date));

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error calculating dynamic bills" });
  }
};
