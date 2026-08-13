import Admin from "../models/Admin.js";
import MealPlan from "../models/MealPlan.js";
import DailyExpense from "../models/DailyExpense.js";

export const calculateMonthSummary = async (
  userId,
  messId,
  month,
) => {
  const indiaNow = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  );

  const currentMonth = `${indiaNow.getFullYear()}-${String(
    indiaNow.getMonth() + 1,
  ).padStart(2, "0")}`;

  const query = {
    userId,
    status: "eat",
  };

  if (month === currentMonth) {
    const yesterday = new Date(indiaNow);

    yesterday.setDate(yesterday.getDate() - 1);

    const lastBillableDate =
      yesterday.toLocaleDateString("en-CA");

    query.date = {
      $gte: `${month}-01`,
      $lte: lastBillableDate,
    };
  } else {
    query.date = {
      $regex: `^${month}`,
    };

    query.locked = true;
  }

  const [mealPlans, expenses, admin] =
    await Promise.all([
      MealPlan.find(query)
        .select("date meal")
        .sort({ date: 1 })
        .lean(),

      DailyExpense.find({
        messId,
        date: {
          $regex: `^${month}`,
        },
      })
        .select("date breakfastCost lunchCost dinnerCost")
        .lean(),

      Admin.findById(messId)
        .select("managementFee")
        .lean(),
    ]);

  const expenseMap = new Map();

  expenses.forEach((expense) => {
    expenseMap.set(expense.date, expense);
  });

  const mealCounts = await MealPlan.aggregate([
    {
      $match: {
        messId,
        status: "eat",
        locked: true,
        date: {
          $regex: `^${month}`,
        },
      },
    },
    {
      $group: {
        _id: {
          date: "$date",
          meal: "$meal",
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  const countMap = new Map();

  mealCounts.forEach((item) => {
    countMap.set(
      `${item._id.date}-${item._id.meal}`,
      item.count,
    );
  });

  let foodBill = 0;

  let breakfastTaken = 0;
  let lunchTaken = 0;
  let dinnerTaken = 0;

  for (const meal of mealPlans) {
    const expense = expenseMap.get(meal.date);

    if (!expense) continue;

    const count =
      countMap.get(
        `${meal.date}-${meal.meal}`,
      ) || 0;

    if (count === 0) continue;

    let rate = 0;

    switch (meal.meal) {
      case "breakfast":
        breakfastTaken++;
        rate =
          expense.breakfastCost / count;
        break;

      case "lunch":
        lunchTaken++;
        rate =
          expense.lunchCost / count;
        break;

      case "dinner":
        dinnerTaken++;
        rate =
          expense.dinnerCost / count;
        break;
    }

    foodBill += rate;
  }

  foodBill = Number(foodBill.toFixed(2));

  const totalMeals =
    breakfastTaken +
    lunchTaken +
    dinnerTaken;

  const managementFee =
    totalMeals > 0
      ? admin?.managementFee || 0
      : 0;

  const totalBill = Number(
    (foodBill + managementFee).toFixed(2),
  );

  return {
    month,

    breakfastTaken,
    lunchTaken,
    dinnerTaken,

    foodBill,
    managementFee,
    totalBill,

    status:
      month === currentMonth
        ? "In Progress"
        : "Pending",

    paid: false,
  };
};

export const calculateCurrentMonthSummary = async (
  userId,
  messId,
) => {
  const indiaNow = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  );

  const currentMonth = `${indiaNow.getFullYear()}-${String(
    indiaNow.getMonth() + 1,
  ).padStart(2, "0")}`;

  return calculateMonthSummary(
    userId,
    messId,
    currentMonth,
  );
};