// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     hostelName: String,
//     enrolmentNumber: {
//       type: String,
//       unique: true,
//     },
//     roomNumber: String,
//     phone: String,

//     authProvider: {
//       type: String,
//       default: "local",
//     },

//     otp: String,
//     otpExpiry: Date,

//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     messId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admin",
//     },
//     isApproved: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true },
// );

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

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

    /*
     * CURRENT APPROVED MESS
     */
    messId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    /*
     * ==========================================
     * PENDING PROFILE UPDATE
     * ==========================================
     *
     * These values are NOT applied to the user
     * until the new mess admin approves them.
     */
    pendingProfileUpdate: {
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

      /*
       * Admin of the NEW mess.
       */
      requestedMessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },

      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },

      requestedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);