import Admin from "../models/Admin.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import MealPlan from "../models/MealPlan.js";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import DailyExpense from "../models/DailyExpense.js";
import Menu from "../models/Menu.js";
import mongoose from "mongoose";
import {
  sendOTPEmail,
  sendApprovalEmail,
  sendRejectionEmail,
  sendDeleteEmail,
} from "../utils/sendEmail.js";
import Complaint from "../models/Complaint.js";
import Feedback from "../models/Feedback.js";

const allowedMesses = [
  "Jhelum Mess",
  "Jhelum Extension Mess",
  "Indus Mess",
  "Chenab Mess",
  "PG Hostel Mess",
  "Girls Mess",
];

const otpStore = new Map();

/* =========================
   SEND OTP
========================= */
export const sendAdminOtp = async (req, res) => {
  try {
    const { email, messName } = req.body;
    // ✅ EMAIL VALIDATION
    const emailRegex = /^[a-zA-Z0-9._%+-]+@nitsri\.ac\.in$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // 🚫 Check if admin already exists for this mess
    const existingMessAdmin = await Admin.findOne({ messName });

    if (existingMessAdmin) {
      return res.status(400).json({
        message: "This mess already has an admin",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    otpStore.set(email, otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ✅ FIXED
        pass: process.env.EMAIL_PASS, // ✅ FIXED
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Admin Signup OTP",
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.log("OTP ERROR:", err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

/* =========================
   VERIFY OTP + SIGNUP
========================= */
export const verifyAdminOtpAndSignup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      messName,
      phoneNumber,
      messAddress,
      otp,
    } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@nitsri\.ac\.in$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const storedOtp = otpStore.get(email);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!allowedMesses.includes(messName)) {
      return res.status(400).json({ message: "Invalid mess selected" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate messCode
    const messCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const admin = await Admin.create({
      fullName,
      email,
      password: hashedPassword,
      messName,
      phoneNumber,
      messAddress,
      messCode,
    });

    otpStore.delete(email);

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      admin: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        messName: admin.messName,
        messCode: admin.messCode,
      },
    });
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Signup error" });
  }
};

/* =========================
   LOGIN
========================= */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      admin: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        messName: admin.messName,
        messCode: admin.messCode,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login error" });
  }
};

/* =========================
   TOMORROW MEAL COUNT (FILTERED)
========================= */
export const getMealCount = async (req, res) => {
  try {
    const messId = req.user.id;
    const students = await User.find({ messId });
    const studentIds = students.map((s) => s._id);

    const today = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    ).toLocaleDateString("en-CA");

    const tomorrowObj = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    tomorrowObj.setDate(tomorrowObj.getDate() + 1);

    const tomorrow = new Date(
  tomorrowObj.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
).toLocaleDateString("en-CA");

    const todayMeals = await MealPlan.find({
      userId: { $in: studentIds },
      date: today,
    });

    const tomorrowMeals = await MealPlan.find({
      userId: { $in: studentIds },
      date: tomorrow,
    });

    const countMeals = (meals) => {
      return {
        breakfast: meals.filter(
          (m) => m.meal === "breakfast" && m.status === "eat",
        ).length,
        lunch: meals.filter((m) => m.meal === "lunch" && m.status === "eat")
          .length,
        dinner: meals.filter((m) => m.meal === "dinner" && m.status === "eat")
          .length,
      };
    };

    res.json({
      today: countMeals(todayMeals),
      tomorrow: countMeals(tomorrowMeals),
    });
  } catch (err) {
    console.log("MEAL COUNT ERROR:", err);
    res.status(500).json({ message: "Error fetching meal count" });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const admin = await Admin.findById(adminId).select(
      "fullName email messName messCode phoneNumber messAddress",
    );

    res.json(admin);
  } catch (err) {
    console.log("GET ADMIN ERROR:", err);
    res.status(500).json({ message: "Error fetching admin details" });
  }
};

export const getStudentsByAdmin = async (req, res) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const students = await User.find({ messId: adminId }).select(
      "fullName email hostelName roomNumber enrolmentNumber phone isApproved",
    );

    res.json(students);
  } catch (err) {
    console.log("GET STUDENTS ERROR:", err);
    res.status(500).json({ message: "Error fetching students" });
  }
};

export const approveStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const existingStudent = await User.findById(studentId);

    if (!existingStudent || existingStudent.messId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const student = await User.findByIdAndUpdate(
      studentId,
      { isApproved: true },
      { new: true },
    );

    if (student) {
      sendApprovalEmail(
        student.email,
        "Your mess account has been approved. You can now login.",
      ).catch(() => {
        console.log("Approval email failed, continuing...");
      });
    }

    res.json({
      message: "Student approved successfully",
      student,
    });
  } catch (err) {
    console.log("APPROVE ERROR:", err);
    res.status(500).json({ message: "Error approving student" });
  }
};

export const rejectStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findByIdAndDelete(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    sendRejectionEmail(
      student.email,
      "Your mess registration has been rejected. Please contact admin.",
    ).catch(() => {
      console.log("Rejection email failed, continuing...");
    });

    res.json({ message: "Student rejected and removed" });
  } catch (err) {
    console.log("REJECT ERROR:", err);
    res.status(500).json({ message: "Error rejecting student" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.messId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    sendDeleteEmail(
      student.email,
      "Your mess account has been deleted by admin. If you think this is a mistake, please contact administration.",
    ).catch(() => {
      console.log("Delete email failed, continuing...");
    });

    // 🔥 NOW DELETE
    await Promise.all([
      MealPlan.deleteMany({ userId: studentId }),
      Complaint.deleteMany({ userId: studentId }),
      Feedback.deleteMany({ userId: studentId }),
    ]);

    await User.findByIdAndDelete(studentId);

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.log("DELETE STUDENT ERROR:", err);
    res.status(500).json({ message: "Error deleting student" });
  }
};

export const getTodayReport = async (req, res) => {
  try {
    const adminId = req.user.id;

    const today = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
).toLocaleDateString("en-CA");

    const expense = await DailyExpense.findOne({
      date: today,
      messId: adminId,
    });

    if (!expense) return res.json([]);

    const breakfastCount = await MealPlan.countDocuments({
      date: today,
      meal: "breakfast",
      status: "eat",
      messId: adminId,
    });

    const lunchCount = await MealPlan.countDocuments({
      date: today,
      meal: "lunch",
      status: "eat",
      messId: adminId,
    });

    const dinnerCount = await MealPlan.countDocuments({
      date: today,
      meal: "dinner",
      status: "eat",
      messId: adminId,
    });

    const breakfastRate =
      breakfastCount > 0 ? expense.breakfastCost / breakfastCount : 0;

    const lunchRate = lunchCount > 0 ? expense.lunchCost / lunchCount : 0;

    const dinnerRate = dinnerCount > 0 ? expense.dinnerCost / dinnerCount : 0;

    const students = await User.find({ messId: adminId });

    const report = [];

    for (const student of students) {
      const meals = await MealPlan.find({
        userId: student._id,
        date: today,
      });

      let data = {
        _id: student._id,
        name: student.fullName,
        enrolment: student.enrolmentNumber,
        breakfast: "skip",
        lunch: "skip",
        dinner: "skip",
        total: 0,
      };

      meals.forEach((m) => {
        if (m.status === "eat") {
          if (m.meal === "breakfast") {
            data.breakfast = breakfastRate;
            data.total += breakfastRate;
          }
          if (m.meal === "lunch") {
            data.lunch = lunchRate;
            data.total += lunchRate;
          }
          if (m.meal === "dinner") {
            data.dinner = dinnerRate;
            data.total += dinnerRate;
          }
        }
      });

      report.push(data);
    }

    res.json(report);
  } catch (err) {
    console.log("REPORT ERROR:", err);
    res.status(500).json({ message: "Error generating report" });
  }
};

export const getStudentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month } = req.query;

    const today = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
).toLocaleDateString("en-CA");

    let filter = { userId: studentId };

    if (month) {
      filter.date = { $regex: `^${month}` };
    }

    const meals = await MealPlan.find(filter);

    const lockedMeals = meals.filter((m) => m.date <= today);

    const student = await User.findById(studentId).select(
      "fullName enrolmentNumber",
    );

    const grouped = {};

    for (const m of lockedMeals) {
      const date = m.date;

      if (!grouped[date]) {
        // 🔥 GET EXPENSE FOR THIS DATE
        const expense = await DailyExpense.findOne({
          date,
          messId: m.messId,
        });

        if (!expense) continue;

        // 🔥 COUNT STUDENTS FOR THIS DATE
        const breakfastCount = await MealPlan.countDocuments({
          date,
          meal: "breakfast",
          status: "eat",
          messId: m.messId,
        });

        const lunchCount = await MealPlan.countDocuments({
          date,
          meal: "lunch",
          status: "eat",
          messId: m.messId,
        });

        const dinnerCount = await MealPlan.countDocuments({
          date,
          meal: "dinner",
          status: "eat",
          messId: m.messId,
        });

        const breakfastRate =
          breakfastCount > 0 ? expense.breakfastCost / breakfastCount : 0;

        const lunchRate = lunchCount > 0 ? expense.lunchCost / lunchCount : 0;

        const dinnerRate =
          dinnerCount > 0 ? expense.dinnerCost / dinnerCount : 0;

        grouped[date] = {
          date,
          name: student.fullName,
          enrolment: student.enrolmentNumber,
          breakfast: 0,
          lunch: 0,
          dinner: 0,
          total: 0,
          rates: {
            breakfastRate,
            lunchRate,
            dinnerRate,
          },
        };
      }

      const entry = grouped[date];

      if (m.status === "eat") {
        if (m.meal === "breakfast") {
          entry.breakfast = entry.rates.breakfastRate;
          entry.total += entry.rates.breakfastRate;
        }
        if (m.meal === "lunch") {
          entry.lunch = entry.rates.lunchRate;
          entry.total += entry.rates.lunchRate;
        }
        if (m.meal === "dinner") {
          entry.dinner = entry.rates.dinnerRate;
          entry.total += entry.rates.dinnerRate;
        }
      }
    }

    const result = Object.values(grouped).map(({ rates, ...rest }) => rest);

    res.json(result);
  } catch (err) {
    console.log("STUDENT HISTORY ERROR:", err);
    res.status(500).json({ message: "Error fetching history" });
  }
};

export const downloadStudentHistoryPDF = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month } = req.query;

    let filter = { userId: studentId };

    if (month) {
      filter.date = { $regex: `^${month}` };
    }

    const meals = await MealPlan.find(filter);
    const today = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
).toLocaleDateString("en-CA");

    const lockedMeals = meals.filter((m) => m.date <= today);

    const student = await User.findById(studentId).select(
      "fullName enrolmentNumber",
    );

    const grouped = {};

    for (const m of lockedMeals) {
      const date = m.date;

      if (!grouped[date]) {
        const expense = await DailyExpense.findOne({
          date,
          messId: m.messId,
        });

        if (!expense) continue;

        const breakfastCount = await MealPlan.countDocuments({
          date,
          meal: "breakfast",
          status: "eat",
          messId: m.messId,
        });

        const lunchCount = await MealPlan.countDocuments({
          date,
          meal: "lunch",
          status: "eat",
          messId: m.messId,
        });

        const dinnerCount = await MealPlan.countDocuments({
          date,
          meal: "dinner",
          status: "eat",
          messId: m.messId,
        });

        const breakfastRate =
          breakfastCount > 0 ? expense.breakfastCost / breakfastCount : 0;

        const lunchRate = lunchCount > 0 ? expense.lunchCost / lunchCount : 0;

        const dinnerRate =
          dinnerCount > 0 ? expense.dinnerCost / dinnerCount : 0;

        grouped[date] = {
          date,
          breakfast: 0,
          lunch: 0,
          dinner: 0,
          total: 0,
          rates: { breakfastRate, lunchRate, dinnerRate },
        };
      }

      const entry = grouped[date];

      if (m.status === "eat") {
        if (m.meal === "breakfast") {
          entry.breakfast = entry.rates.breakfastRate;
          entry.total += entry.rates.breakfastRate;
        }
        if (m.meal === "lunch") {
          entry.lunch = entry.rates.lunchRate;
          entry.total += entry.rates.lunchRate;
        }
        if (m.meal === "dinner") {
          entry.dinner = entry.rates.dinnerRate;
          entry.total += entry.rates.dinnerRate;
        }
      }
    }

    const data = Object.values(grouped).map(({ rates, ...rest }) => rest);

    // 📄 Create PDF
    const doc = new PDFDocument();
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Student-${student.fullName}-${month}.pdf`,
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(18).text("Student Meal Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Name: ${student.fullName}`);
    doc.text(`Enrollment: ${student.enrolmentNumber}`);
    doc.text(`Month: ${month}`);
    doc.moveDown();

    let grandTotal = 0;

    data.forEach((d) => {
      doc.text(
        `${d.date} | ₹${d.breakfast} | ₹${d.lunch} | ₹${d.dinner} | Total: ₹${d.total}`,
      );
      grandTotal += d.total;
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total Bill: ₹${grandTotal}`);

    doc.end();
  } catch (err) {
    console.log("PDF ERROR:", err);
    res.status(500).json({ message: "Error generating PDF" });
  }
};

export const setMenu = async (req, res) => {
  try {
    const { day, breakfast, lunch, dinner } = req.body;

    const messId = new mongoose.Types.ObjectId(req.user.id);

    const menu = await Menu.findOneAndUpdate(
      { messId, day },
      { breakfast, lunch, dinner },
      { upsert: true, new: true },
    );

    res.json(menu);
  } catch (err) {
    console.log("SET MENU ERROR:", err);
    res.status(500).json({ message: "Error setting menu" });
  }
};

export const getMenu = async (req, res) => {
  try {
    const { day } = req.query;

    const menu = await Menu.findOne({
      day,
      messId: new mongoose.Types.ObjectId(req.user.id),
    });

    res.json(menu || {});
  } catch (err) {
    console.log("GET MENU ERROR:", err);
    res.status(500).json({ message: "Error fetching menu" });
  }
};

export const getMenuForStudent = async (req, res) => {
  try {
    const { day, messId } = req.query;

    if (!messId) {
      return res.status(400).json({ message: "messId required" });
    }

    const menu = await Menu.findOne({
      day,
      messId: new mongoose.Types.ObjectId(messId),
    });

    res.json(menu || {});
  } catch (err) {
    console.log("GET MENU STUDENT ERROR:", err);
    res.status(500).json({ message: "Error fetching menu" });
  }
};

export const getMesses = async (req, res) => {
  try {
    const messes = await Admin.find().select("messName messCode");
    res.json(messes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messes" });
  }
};

export const adminForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.otp = otp;
    admin.otpExpiry = Date.now() + 5 * 60 * 1000;
    await admin.save();

    await sendOTPEmail(email, otp);

    const check = await Admin.findOne({ email });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

export const adminResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const enteredOtp = String(otp).trim();

    if (!admin.otp || admin.otp !== enteredOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (admin.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;
    admin.otp = null;
    admin.otpExpiry = null;

    await admin.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error resetting password" });
  }
};
