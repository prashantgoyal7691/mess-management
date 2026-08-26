import mongoose from "mongoose";

const pendingProfileUpdateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },

    hostelName: {
      type: String,
    },

    roomNumber: {
      type: String,
    },

    enrolmentNumber: {
      type: String,
    },

    phone: {
      type: String,
    },

    requestedMessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
    },

    requestedAt: {
      type: Date,
    },
  },
  {
    _id: false,
    default: undefined,
  }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    hostelName: {
      type: String,
    },

    enrolmentNumber: {
      type: String,
      unique: true,
    },

    roomNumber: {
      type: String,
    },

    phone: {
      type: String,
    },

    authProvider: {
      type: String,
      default: "local",
    },

    otp: String,

    otpExpiry: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },

    messId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    pendingProfileUpdate: pendingProfileUpdateSchema,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);