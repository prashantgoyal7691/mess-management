import mongoose from "mongoose";

const messBreakdownSchema = new mongoose.Schema(
  {
    messId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    breakfastCount: {
      type: Number,
      default: 0,
    },

    lunchCount: {
      type: Number,
      default: 0,
    },

    dinnerCount: {
      type: Number,
      default: 0,
    },

    foodBill: {
      type: Number,
      default: 0,
    },

    managementFee: {
      type: Number,
      default: 0,
    },

    totalBill: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const monthlyInvoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    month: {
      type: String,
      required: true,
    },

    messBreakdown: {
      type: [messBreakdownSchema],
      default: [],
    },

    breakfastCount: {
      type: Number,
      default: 0,
    },

    lunchCount: {
      type: Number,
      default: 0,
    },

    dinnerCount: {
      type: Number,
      default: 0,
    },

    foodBill: {
      type: Number,
      default: 0,
    },

    managementFee: {
      type: Number,
      default: 0,
    },

    totalBill: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    razorpayOrderId: String,

    razorpayPaymentId: String,

    paidAt: Date,
  },
  { timestamps: true },
);

monthlyInvoiceSchema.index(
  {
    userId: 1,
    month: 1,
  },
  { unique: true },
);

monthlyInvoiceSchema.index({
  month: 1,
  messId: 1,
});

export default mongoose.model(
  "MonthlyInvoice",
  monthlyInvoiceSchema,
);