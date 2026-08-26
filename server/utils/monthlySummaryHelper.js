import Admin from "../models/Admin.js";
import MealPlan from "../models/MealPlan.js";
import DailyExpense from "../models/DailyExpense.js";

export const calculateMonthSummary = async (
  userId,
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

  const mealPlans = await MealPlan.find(query)
    .select("date meal messId")
    .sort({ date: 1 })
    .lean();

  if (mealPlans.length === 0) {
    return {
      month,
      breakfastTaken: 0,
      lunchTaken: 0,
      dinnerTaken: 0,
      foodBill: 0,
      managementFee: 0,
      totalBill: 0,
      messBreakdown: [],
      status:
        month === currentMonth
          ? "In Progress"
          : "Pending",
      paid: false,
    };
  }

  const messIds = [
  ...new Map(
    mealPlans
      .filter((meal) => meal.messId)
      .map((meal) => [
        meal.messId.toString(),
        meal.messId,
      ]),
  ).values(),
];

  const dates = [
    ...new Set(
      mealPlans.map((meal) => meal.date),
    ),
  ];

  const [expenses, mealCounts, admins] =
    await Promise.all([
      DailyExpense.find({
        messId: { $in: messIds },
        date: { $in: dates },
      })
        .select(
          "messId date breakfastCost lunchCost dinnerCost",
        )
        .lean(),

      MealPlan.aggregate([
        {
          $match: {
            messId: { $in: messIds },
            status: "eat",
            locked: true,
            date: {
              $in: dates,
            },
          },
        },
        {
          $group: {
            _id: {
              messId: "$messId",
              date: "$date",
              meal: "$meal",
            },
            count: {
              $sum: 1,
            },
          },
        },
      ]),

      Admin.find({
        _id: { $in: messIds },
      })
        .select("managementFee")
        .lean(),
    ]);

  const expenseMap = new Map();

  expenses.forEach((expense) => {
    expenseMap.set(
      `${expense.messId.toString()}-${expense.date}`,
      expense,
    );
  });

  const countMap = new Map();

  mealCounts.forEach((item) => {
    countMap.set(
      `${item._id.messId.toString()}-${item._id.date}-${item._id.meal}`,
      item.count,
    );
  });

  const adminMap = new Map();

  admins.forEach((admin) => {
    adminMap.set(
      admin._id.toString(),
      admin,
    );
  });

  const breakdownMap = new Map();

  for (const meal of mealPlans) {
    if (!meal.messId) {
      continue;
    }

    const messId = meal.messId.toString();

    const expense = expenseMap.get(
      `${messId}-${meal.date}`,
    );

    if (!expense) {
      continue;
    }

    const count =
      countMap.get(
        `${messId}-${meal.date}-${meal.meal}`,
      ) || 0;

    if (count === 0) {
      continue;
    }

    let rate = 0;

    if (meal.meal === "breakfast") {
      rate = expense.breakfastCost / count;
    }

    if (meal.meal === "lunch") {
      rate = expense.lunchCost / count;
    }

    if (meal.meal === "dinner") {
      rate = expense.dinnerCost / count;
    }

    if (!breakdownMap.has(messId)) {
      breakdownMap.set(messId, {
        messId: meal.messId,
        breakfastCount: 0,
        lunchCount: 0,
        dinnerCount: 0,
        foodBill: 0,
        managementFee: 0,
        totalBill: 0,
      });
    }

    const breakdown = breakdownMap.get(messId);

    if (meal.meal === "breakfast") {
      breakdown.breakfastCount++;
    }

    if (meal.meal === "lunch") {
      breakdown.lunchCount++;
    }

    if (meal.meal === "dinner") {
      breakdown.dinnerCount++;
    }

    breakdown.foodBill += rate;
  }

  const messBreakdown = [];

  for (const breakdown of breakdownMap.values()) {
    breakdown.foodBill = Number(
      breakdown.foodBill.toFixed(2),
    );

    const totalMeals =
      breakdown.breakfastCount +
      breakdown.lunchCount +
      breakdown.dinnerCount;

    const admin = adminMap.get(
      breakdown.messId.toString(),
    );

    breakdown.managementFee =
      totalMeals > 0
        ? admin?.managementFee || 0
        : 0;

    breakdown.totalBill = Number(
      (
        breakdown.foodBill +
        breakdown.managementFee
      ).toFixed(2),
    );

    messBreakdown.push(breakdown);
  }

  const breakfastTaken =
    messBreakdown.reduce(
      (sum, item) =>
        sum + item.breakfastCount,
      0,
    );

  const lunchTaken =
    messBreakdown.reduce(
      (sum, item) =>
        sum + item.lunchCount,
      0,
    );

  const dinnerTaken =
    messBreakdown.reduce(
      (sum, item) =>
        sum + item.dinnerCount,
      0,
    );

  const foodBill = Number(
    messBreakdown
      .reduce(
        (sum, item) =>
          sum + item.foodBill,
        0,
      )
      .toFixed(2),
  );

  const managementFee = Number(
    messBreakdown
      .reduce(
        (sum, item) =>
          sum + item.managementFee,
        0,
      )
      .toFixed(2),
  );

  const totalBill = Number(
    (
      foodBill +
      managementFee
    ).toFixed(2),
  );

  return {
    month,

    breakfastTaken,
    lunchTaken,
    dinnerTaken,

    foodBill,
    managementFee,
    totalBill,

    messBreakdown,

    status:
      month === currentMonth
        ? "In Progress"
        : "Pending",

    paid: false,
  };
};

export const calculateCurrentMonthSummary = async (
  userId,
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
    currentMonth,
  );
};