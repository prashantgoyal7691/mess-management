import User from "../models/User.js";
import MonthlyInvoice from "../models/MonthlyInvoice.js";
import { calculateMonthSummary } from "../utils/monthlySummaryHelper.js";

export const generateInvoicesForPreviousMonth = async () => {
  const indiaNow = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  );

  indiaNow.setMonth(
    indiaNow.getMonth() - 1,
  );

  const month = `${indiaNow.getFullYear()}-${String(
    indiaNow.getMonth() + 1,
  ).padStart(2, "0")}`;

  const students = await User.find({
    isApproved: true,
  }).select("_id messId");

  let generated = 0;
  console.log("Invoice month:", month);
  console.log("Approved students:", students.length);
  for (const student of students) {
    const existingInvoice =
      await MonthlyInvoice.findOne({
        userId: student._id,
        month,
      })
        .select("_id")
        .lean();

    if (existingInvoice) {
      continue;
    }

    const summary =
      await calculateMonthSummary(
        student._id,
        month,
      );

    const totalMeals =
      summary.breakfastTaken +
      summary.lunchTaken +
      summary.dinnerTaken;

    if (totalMeals === 0) {
      continue;
    }

    const primaryMessId =
      summary.messBreakdown.length === 1
        ? summary.messBreakdown[0].messId
        : student.messId;

    await MonthlyInvoice.create({
      userId: student._id,
      messId: primaryMessId,

      month,

      messBreakdown:
        summary.messBreakdown,

      breakfastCount:
        summary.breakfastTaken,

      lunchCount:
        summary.lunchTaken,

      dinnerCount:
        summary.dinnerTaken,

      foodBill:
        summary.foodBill,

      managementFee:
        summary.managementFee,

      totalBill:
        summary.totalBill,
    });

    generated++;

    console.log(
      `Invoice generated for ${student._id} (${month})`,
    );

    console.log("Student:", student._id.toString());
    console.log("Summary:", summary);
    console.log("Total meals:", totalMeals);
  }



  console.log(
    `Generated ${generated} invoices for ${month}`,
  );

  return generated;
};