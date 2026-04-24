import Feedback from "../models/Feedback.js";
import User from "../models/User.js";

// 🟢 Create feedback
export const createFeedback = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    const { type, message } = req.body;
    const today = new Date().toISOString().split("T")[0];

    // 🔍 Check if feedback already exists for same meal & date
    const existing = await Feedback.findOne({
      userId,
      type,
      date: today,
    });

    let feedback;

    if (existing) {
      // 🔁 Update existing feedback
      existing.message = message;
      feedback = await existing.save();

      return res.json({ message: "Feedback updated", feedback });
    }

    // ➕ Create new feedback if not exists
    feedback = await Feedback.create({
      userId,
      messId: user.messId,
      type,
      date: today,
      message,
    });

    res.json({ message: "Feedback submitted", feedback });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating feedback" });
  }
};

export const getMyFeedbacks = async (req, res) => {
  try {
    const userId = req.user.id;

    const feedbacks = await Feedback.find({ userId }).sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feedbacks" });
  }
};


export const getAdminFeedbacks = async (req, res) => {
  try {
    const adminId = req.user.id;

    const feedbacks = await Feedback.find({ messId: adminId })
      .populate("userId", "fullName enrolmentNumber")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin feedbacks" });
  }
};
