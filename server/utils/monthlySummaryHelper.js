import Admin from "../models/Admin.js";
import MealPlan from "../models/MealPlan.js";
import { getMealRates } from "./billingHelper.js";

export const calculateMonthSummary = async (userId, messId, month) => {
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
    const lastBillableDate = yesterday.toLocaleDateString("en-CA");
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

  const mealPlans = await MealPlan.find(query).sort({ date: 1 });

  let foodBill = 0;
  let breakfastTaken = 0;
  let lunchTaken = 0;
  let dinnerTaken = 0;

  // Cache meal rates so we calculate them only once per date
  const rateCache = new Map();

  for (const meal of mealPlans) {
    let rates = rateCache.get(meal.date);

    if (!rates) {
      rates = await getMealRates(messId, meal.date);

      if (!rates) continue;

      rateCache.set(meal.date, rates);
    }

    switch (meal.meal) {
      case "breakfast":
        breakfastTaken++;
        foodBill += rates.breakfastRate;
        break;

      case "lunch":
        lunchTaken++;
        foodBill += rates.lunchRate;
        break;

      case "dinner":
        dinnerTaken++;
        foodBill += rates.dinnerRate;
        break;
    }
  }

  foodBill = Number(foodBill.toFixed(2));

  const admin = await Admin.findById(messId).select("managementFee").lean();

  const managementFee =
    breakfastTaken + lunchTaken + dinnerTaken > 0
      ? admin?.managementFee || 0
      : 0;

  const totalBill = Number((foodBill + managementFee).toFixed(2));

  return {
    month,

    breakfastTaken,
    lunchTaken,
    dinnerTaken,

    foodBill,
    managementFee,

    totalBill,

    status: month === currentMonth ? "In Progress" : "Pending",

    paid: false,
  };
};

export const calculateCurrentMonthSummary = async (userId, messId) => {
  const indiaNow = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  );

  const currentMonth = `${indiaNow.getFullYear()}-${String(
    indiaNow.getMonth() + 1,
  ).padStart(2, "0")}`;

  return calculateMonthSummary(userId, messId, currentMonth);
};
