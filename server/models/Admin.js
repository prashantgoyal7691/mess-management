import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    messName: { type: String, required: true },

    phoneNumber: String,

    messAddress: String,

    role: {
      type: String,
      default: "admin",
    },
    messCode: {
      type: String,
      unique: true,
      required: true,
    },
    managementFee: {
      type: Number,
      default: 0,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Number,
    },
    
  },
  { timestamps: true },
);

export default mongoose.model("Admin", adminSchema);
