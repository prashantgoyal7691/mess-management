import DailyExpense from "../models/DailyExpense.js";
import MealPlan from "../models/MealPlan.js";
import User from "../models/User.js";
import { lockOldMeals } from "../jobs/lockMeals.js";
import MonthlyInvoice from "../models/MonthlyInvoice.js";
import { getMealCounts, getMealRates } from "../utils/billingHelper.js";
import { calculateMonthSummary } from "../utils/monthlySummaryHelper.js";
import { generateInvoicesForPreviousMonth } from "../jobs/invoiceGenerator.js";
import PDFDocument from "pdfkit";

// ADMIN SET EXPENSE
export const setDailyExpense = async (req, res) => {
  try {
    const adminId = req.user.id;

    const { breakfastCost, lunchCost, dinnerCost } = req.body;
    // const { breakfastCost, lunchCost, dinnerCost, date } = req.body;

    const indiaNow = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    );

    const tomorrowObj = new Date(indiaNow);
    tomorrowObj.setDate(tomorrowObj.getDate() + 1);
    const date = tomorrowObj.toLocaleDateString("en-CA");

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

export const getExpenseHistory = async (req, res) => {
  try {
    const adminId = req.user.id;

    // 🔹 Get all expenses for this admin
    const expenses = await DailyExpense.find({
      messId: adminId,
    }).sort({ date: -1 });

    const result = [];

    for (const exp of expenses) {
      const date = exp.date;

      const { breakfastCount, lunchCount, dinnerCount } = await getMealCounts(
        adminId,
        date,
      );

      result.push({
        date,
        breakfastCost: exp.breakfastCost,
        lunchCost: exp.lunchCost,
        dinnerCost: exp.dinnerCost,
        breakfastCount,
        lunchCount,
        dinnerCount,
      });
    }

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching expense history" });
  }
};

export const runLockNow = async (req, res) => {
  try {
    await lockOldMeals();

    res.json({
      message: "Meals locked successfully (manual trigger)",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error running lock",
    });
  }
};

export const generateMonthlyInvoices = async (req, res) => {
  try {
    const generated = await generateInvoicesForPreviousMonth();

    res.json({
      message: `Generated ${generated} monthly invoices successfully.`,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Error generating monthly invoices",
    });
  }
};

export const getMyInvoices = async (req, res) => {
  try {
    const invoices = await MonthlyInvoice.find({
      userId: req.user.id,
    }).sort({ month: -1 });

    res.json(invoices);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error fetching invoices",
    });
  }
};

export const getMonthlySummary = async (req, res,) => {
  try {
    const { month } = req.query;

    if (
      !month ||
      !/^\d{4}-\d{2}$/.test(month)
    ) {
      return res.status(400).json({
        message:
          "Invalid month. Use YYYY-MM",
      });
    }

    const user = await User.findById(
      req.user.id,
    )
      .select("_id")
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const invoice =
      await MonthlyInvoice.findOne({
        userId: user._id,
        month,
      }).lean();

    if (invoice) {
      return res.json({
        month: invoice.month,

        breakfastTaken:
          invoice.breakfastCount,

        lunchTaken:
          invoice.lunchCount,

        dinnerTaken:
          invoice.dinnerCount,

        foodBill:
          invoice.foodBill,

        managementFee:
          invoice.managementFee,

        totalBill:
          invoice.totalBill,

        messBreakdown:
          invoice.messBreakdown || [],

        status:
          invoice.paymentStatus === "paid"
            ? "Paid"
            : "Pending",

        paid:
          invoice.paymentStatus === "paid",
      });
    }

    const summary =
      await calculateMonthSummary(
        user._id,
        month,);

    res.json(summary);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message:
        "Error fetching monthly summary",
    });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const month = req.params.month;

    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const invoice = await MonthlyInvoice.findOne({
      userId: user._id,
      month,
    }).lean();

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const meals = await MealPlan.find({
      userId: user._id,
      status: "eat",
      locked: true,
      date: {
        $regex: `^${month}`,
      },
    })
      .select(
        "date meal messId",
      )
      .sort({ date: 1 });

    const rateCache = new Map();
    const dailyRows = [];

    for (const meal of meals) {
      let rates = rateCache.get(meal.date);

      if (!rates) {
        rates = await getMealRates(meal.messId, meal.date);

        if (!rates) continue;

        rateCache.set(meal.date, rates);
      }

      let row = dailyRows.find((r) => r.date === meal.date);

      if (!row) {
        row = {
          date: meal.date,
          messId: meal.messId,
          breakfast: "-",
          lunch: "-",
          dinner: "-",
        };

        dailyRows.push(row);
      }

      switch (meal.meal) {
        case "breakfast":
          row.breakfast = `₹${rates.breakfastRate}`;
          break;

        case "lunch":
          row.lunch = `₹${rates.lunchRate}`;
          break;

        case "dinner":
          row.dinner = `₹${rates.dinnerRate}`;
          break;
      }
    }

    // ---------------- PDF ----------------

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${month}.pdf`,
    );

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    doc.pipe(res);

    // ===========================
    // Title
    // ===========================

    doc.fontSize(22).text("MESS MANAGEMENT SYSTEM", {
      align: "center",
    });

    doc.fontSize(18).text("MONTHLY INVOICE", {
      align: "center",
    });

    doc.moveDown(2);

    // ===========================
    // Student Details
    // ===========================

    doc.fontSize(12);

    doc.text(`Student Name : ${user.fullName}`);
    doc.text(`Enrollment No : ${user.enrolmentNumber}`);
    doc.text(`Hostel : ${user.hostelName}`);
    doc.text(`Room Number : ${user.roomNumber}`);
    doc.text(`Month : ${month}`);

    doc.moveDown(2);

    // ===========================
    // Table Header
    // ===========================

    let y = doc.y;

    doc.font("Helvetica-Bold");

    doc.text("Date", 50, y);
    doc.text("Mess", 120, y);
    doc.text("Breakfast", 250, y);
    doc.text("Lunch", 350, y);
    doc.text("Dinner", 450, y);

    doc
      .moveTo(50, y + 18)
      .lineTo(550, y + 18)
      .stroke();

    doc.font("Helvetica");

    y += 30;

    // ===========================
    // Table Rows
    // ===========================

    dailyRows.forEach((row) => {
      doc.text(row.date, 50, y);
      doc.text(row.breakfast, 170, y);
      doc.text(row.lunch, 290, y);
      doc.text(row.dinner, 410, y);

      y += 22;

      // New page if required
      if (y > 720) {
        doc.addPage();
        y = 50;
      }
    });

    doc.moveDown(2);

    doc.y = y + 20;

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    doc.moveDown();

    doc.font("Helvetica-Bold");

    doc.text(`Breakfast Taken : ${invoice.breakfastCount}`);
    doc.text(`Lunch Taken : ${invoice.lunchCount}`);
    doc.text(`Dinner Taken : ${invoice.dinnerCount}`);

    doc.moveDown();

    doc.text(`Food Bill : ₹${invoice.foodBill}`);
    doc.text(`Management Fee : ₹${invoice.managementFee}`);

    doc.fontSize(15);

    doc.text(`Total Bill : ₹${invoice.totalBill}`);

    doc.moveDown();

    doc.fontSize(12);

    doc.text(`Payment Status : ${invoice.paymentStatus}`);

    doc.moveDown();

    const generatedOn = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    ).toLocaleDateString("en-IN");

    doc.text(`Generated On : ${generatedOn}`);

    // Finish PDF
    doc.end();
  } catch (err) {
    console.log(err);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Error downloading invoice",
      });
    }
  }
};
