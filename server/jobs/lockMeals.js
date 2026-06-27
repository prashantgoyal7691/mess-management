import MealPlan from "../models/MealPlan.js";

export const lockOldMeals = async () => {
  const today = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  );

  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const lockDate = tomorrow.toLocaleDateString("en-CA");

  await MealPlan.updateMany(
    {
      date: { $lte: lockDate },
      locked: { $ne: true },
    },
    {
      $set: { locked: true },
    },
  );

  console.log("Meals locked till:", lockDate);
};
