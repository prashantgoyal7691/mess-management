import MealPlan from "../models/MealPlan.js";
import DailyExpense from "../models/DailyExpense.js";

export const getMealCounts = async (messId, date) => {
  const [breakfastCount, lunchCount, dinnerCount] = await Promise.all([
    MealPlan.countDocuments({
      messId,
      date,
      meal: "breakfast",
      status: "eat",
      locked: true,
    }),

    MealPlan.countDocuments({
      messId,
      date,
      meal: "lunch",
      status: "eat",
      locked: true,
    }),

    MealPlan.countDocuments({
      messId,
      date,
      meal: "dinner",
      status: "eat",
      locked: true,
    }),
  ]);

  return {
    breakfastCount,
    lunchCount,
    dinnerCount,
  };
};

export const getMealRates = async (messId, date) => {
  const expense = await DailyExpense.findOne({
    messId,
    date,
  });

  console.log("Expense:", expense);

  if (!expense) return null;

  const {
    breakfastCount,
    lunchCount,
    dinnerCount,
  } = await getMealCounts(messId, date);

  return {
    breakfastRate:
      breakfastCount > 0
        ? Number((expense.breakfastCost / breakfastCount).toFixed(2))
        : 0,

    lunchRate:
      lunchCount > 0
        ? Number((expense.lunchCost / lunchCount).toFixed(2))
        : 0,

    dinnerRate:
      dinnerCount > 0
        ? Number((expense.dinnerCost / dinnerCount).toFixed(2))
        : 0,

    breakfastCount,
    lunchCount,
    dinnerCount,
  };
};
