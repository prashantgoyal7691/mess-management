import User from "../models/User.js";
import Admin from "../models/Admin.js";

const mapHtoM = {
  "pg hostel": "pg hostel mess",
  "jhelum hostel": "jhelum mess",
  "jhelum extension hostel": "jhelum extension mess",
  "indus hostel": "indus mess",
  "chenab hostel": "chenab mess",
  "girls hostel": "girls mess",
};

/*
 * Normalize strings
 */
const normalize = (value) => {
  return value?.trim().toLowerCase();
};

export const createProfileUpdateRequest = async (req, res) => {
  try {
    const userId = req.user?.id;

    console.log("\n========== CREATE PROFILE UPDATE ==========");
    console.log("Student JWT ID:", userId);
    console.log("Request body:", req.body);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      fullName,
      hostelName,
      roomNumber,
      enrolmentNumber,
      phone,
    } = req.body;

    /*
     * Validate fields
     */
    if (
      !fullName?.trim() ||
      !hostelName?.trim() ||
      !roomNumber?.trim() ||
      !enrolmentNumber?.trim() ||
      !phone?.trim()
    ) {
      return res.status(400).json({
        message: "All profile fields are required.",
      });
    }

    /*
     * Find user
     */
    const user = await User.findById(userId);

    console.log("Student found:", !!user);
    if (user) {
      console.log("Student DB ID:", user._id.toString());
      console.log(
        "Existing pending request:",
        user.pendingProfileUpdate
      );
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    /*
     * Don't allow multiple pending requests.
     * Only block if there is actually a pending request.
     */

    console.log(
      "Existing pending status:",
      user.pendingProfileUpdate?.status
    );
    const existingPending = user.pendingProfileUpdate;

    console.log("Existing pending request:", existingPending);

    if (
      existingPending?.status === "pending" &&
      existingPending?.requestedMessId
    ) {
      console.log("VALID PENDING REQUEST FOUND");

      return res.status(400).json({
        message: "You already have a profile update request pending.",
      });
    }

    // Repair old broken records such as:
    // { status: "pending" }
    if (
      existingPending?.status === "pending" &&
      !existingPending?.requestedMessId
    ) {
      console.warn(
        "Removing stale/incomplete pending profile update:",
        existingPending
      );

      user.pendingProfileUpdate = undefined;
    }

    /*
     * Normalize hostel name
     */
    const normalizedHostel = normalize(hostelName);

    const messName = mapHtoM[normalizedHostel];

    if (!messName) {
      return res.status(400).json({
        message: "Invalid hostel selected.",
      });
    }

    const admin = await Admin.findOne({
      messName: {
        $regex: `^${messName.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    console.log("========== TARGET ADMIN ==========");
    console.log("Selected hostel:", normalizedHostel);
    console.log("Resolved mess:", messName);
    console.log("Admin found:", !!admin);

    if (admin) {
      console.log("Target Admin ID:", admin._id.toString());
      console.log("Target Admin mess:", admin.messName);
    }

    if (!admin) {
      return res.status(404).json({
        message: "Admin for the selected mess was not found.",
      });
    }

    user.pendingProfileUpdate = {
      fullName: fullName.trim(),
      hostelName: normalizedHostel,
      roomNumber: roomNumber.trim(),
      enrolmentNumber: enrolmentNumber.trim(),
      phone: phone.trim(),

      requestedMessId: admin._id,

      status: "pending",

      requestedAt: new Date(),
    };

    await user.save();

    console.log("========== REQUEST SAVED ==========");
    console.log({
      studentId: user._id.toString(),
      requestedMessId:
        user.pendingProfileUpdate.requestedMessId.toString(),
      status: user.pendingProfileUpdate.status,
      requestedAt: user.pendingProfileUpdate.requestedAt,
    });

    console.log("REQUEST SAVED SUCCESSFULLY");
    console.log(
      "Saved pendingProfileUpdate:",
      user.pendingProfileUpdate
    );

    console.log("PROFILE UPDATE REQUEST CREATED SUCCESSFULLY");

    console.log("====================================\n");
    return res.status(201).json({
      message:
        "Profile update request sent to the selected mess admin.",
    });
  } catch (error) {
    console.error(
      "CREATE PROFILE UPDATE ERROR:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const getProfileUpdateRequests = async (req, res) => {
  try {
    const adminId = req.user?.id;

    console.log("\n========== GET PROFILE UPDATE REQUESTS ==========");
    console.log("Admin JWT ID:", adminId);

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const requests = await User.find({
      "pendingProfileUpdate.status": "pending",
      "pendingProfileUpdate.requestedMessId": adminId,
    })
      .select(
        "fullName email hostelName roomNumber enrolmentNumber phone messId pendingProfileUpdate",
      )
      .populate("messId", "fullName messName messCode")
      .populate(
        "pendingProfileUpdate.requestedMessId",
        "fullName messName messCode",
      )
      .sort({ "pendingProfileUpdate.requestedAt": -1 });

    console.log("Matching requests:", requests.length);

    return res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error("GET PROFILE UPDATE REQUESTS ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};


export const approveProfileUpdate = async (
  req,
  res,
) => {
  try {
    const adminId = req.user?.id;

    const { studentId } = req.params;

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    /*
     * Find user
     */
    const user = await User.findById(studentId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    /*
     * Get pending request
     */
    const pending = user.pendingProfileUpdate;

    if (
      !pending ||
      pending.status !== "pending"
    ) {
      return res.status(400).json({
        message:
          "No pending profile update request found.",
      });
    }

    /*
     * SECURITY CHECK
     *
     * Only the admin assigned to the request
     * can approve it.
     */
    if (
      !pending.requestedMessId ||
      pending.requestedMessId.toString() !== adminId.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to process this request.",
      });
    }

    /*
     * =====================================================
     * APPLY UPDATE
     * =====================================================
     */

    await User.updateOne(
      { _id: studentId },
      {
        $set: {
          fullName: pending.fullName,
          hostelName: pending.hostelName,
          roomNumber: pending.roomNumber,
          enrolmentNumber: pending.enrolmentNumber,
          phone: pending.phone,
          messId: pending.requestedMessId,
        },
        $unset: {
          pendingProfileUpdate: "",
        },
      },
    );

    return res.status(200).json({
      message:
        "Profile update approved successfully.",
    });
  } catch (error) {
    console.error(
      "APPROVE PROFILE UPDATE ERROR:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

/*
 * =========================================================
 * ADMIN:
 * REJECT PROFILE UPDATE
 * =========================================================
 *
 * DELETE /api/admin/profile-update-requests/:studentId/reject
 */

export const rejectProfileUpdate = async (
  req,
  res,
) => {
  try {
    const adminId = req.user?.id;

    const { studentId } = req.params;

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    /*
     * Find user
     */
    const user = await User.findById(studentId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    /*
     * Get pending request
     */
    const pending = user.pendingProfileUpdate;

    if (
      !pending ||
      pending.status !== "pending"
    ) {
      return res.status(400).json({
        message:
          "No pending profile update request found.",
      });
    }

    /*
     * SECURITY CHECK
     */
    if (
      !pending.requestedMessId ||
      pending.requestedMessId.toString() !== adminId.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to process this request.",
      });
    }

    /*
     * IMPORTANT:
     *
     * Do NOT modify the user's actual profile.
     *
     * Just remove the pending request.
     */

    await User.updateOne(
      { _id: studentId },
      {
        $unset: {
          pendingProfileUpdate: "",
        },
      },
    );

    return res.status(200).json({
      message:
        "Profile update rejected. Previous details remain unchanged.",
    });
  } catch (error) {
    console.error(
      "REJECT PROFILE UPDATE ERROR:",
      error,
    );

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};