// import StudentLayout from "../../layouts/StudentLayout";
// import { useAuthStore } from "../../stores/authStore";

// export default function StudentDetails() {
//   // const [user, setUser] = useState(null);

//   // useEffect(() => {
//   //   const fetchUser = async () => {
//   //     try {
//   //       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
//   //         headers: {
//   //           Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
//   //         },
//   //       });

//   //       const data = await res.json();
//   //       setUser(data); // 🔥 THIS WAS MISSING
//   //     } catch (err) {
//   //       console.log(err);
//   //     }
//   //   };

//   //   fetchUser();
//   // }, []);
//   const user = useAuthStore((state) => state.user);

//   if (!user) {
//     return (
//       <StudentLayout>
//         <div className="p-6 text-center">Loading...</div>
//       </StudentLayout>
//     );
//   }

//   return (
//     <StudentLayout>
//       <div className="p-4 md:p-6 flex justify-center">
//         <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg w-full max-w-2xl">
//           <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
//             Student Profile
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//             <div>
//               <p className="text-gray-500 text-sm">Full Name</p>
//               <p className="text-base md:text-lg font-semibold">{user?.fullName || "-"}</p>
//             </div>

//             <div>
//               <p className="text-gray-500 text-sm">Email</p>
//               <p className="text-base md:text-lg font-semibold">{user?.email || "-"}</p>
//             </div>

//             <div>
//               <p className="text-gray-500 text-sm">Hostel</p>
//               <p className="text-base md:text-lg font-semibold">{user?.hostelName || "-"}</p>
//             </div>

//             <div>
//               <p className="text-gray-500 text-sm">Room Number</p>
//               <p className="text-base md:text-lg font-semibold">{user?.roomNumber || "-"}</p>
//             </div>

//             <div>
//               <p className="text-gray-500 text-sm">Enrollment Number</p>
//               <p className="text-base md:text-lg font-semibold">
//                 {user?.enrolmentNumber || "-"}
//               </p>
//             </div>

//             <div>
//               <p className="text-gray-500 text-sm">Phone</p>
//               <p className="text-base md:text-lg font-semibold">{user?.phone || "-"}</p>
//             </div>

//             <div>
//               <p className="text-gray-500 text-sm">Student Id</p>
//               <p className="text-base md:text-lg font-semibold">{user?._id || "-"}</p>
//             </div>

//             <div>
//               <p className="text-gray-500 text-sm">messCode</p>
//               <p className="text-base md:text-lg font-semibold">{user?.messId?.messCode || "-"}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </StudentLayout>
//   );
// }

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { useAuthStore } from "../../stores/authStore";

export default function StudentDetails() {
  const user = useAuthStore((state) => state.user);
  const PROFILE_UPDATE_COOLDOWN_MS = 48 * 60 * 60 * 1000;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [message, setMessage] = useState("");

  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const [formData, setFormData] = useState({
    fullName: "",
    hostelName: "",
    roomNumber: "",
    enrolmentNumber: "",
    phone: "",
  });

  /*
   * Hostel -> Mess mapping
   */
  const mapHtoM = {
    "pg hostel": "pg hostel mess",
    "jhelum hostel": "jhelum mess",
    "jhelum extension hostel": "jhelum extension mess",
    "indus hostel": "indus mess",
    "chenab hostel": "chenab mess",
    "girls hostel": "girls mess",
  };

  /*
   * Load current approved user details
   */
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        hostelName: user.hostelName || "",
        roomNumber: user.roomNumber || "",
        enrolmentNumber: user.enrolmentNumber || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;

    const key = `profileUpdateCooldown:${user._id}`;
    const storedUntil = localStorage.getItem(key);

    if (!storedUntil) {
      setCooldownUntil(null);
      setCooldownRemaining(0);
      return;
    }

    const until = Number(storedUntil);

    if (!Number.isFinite(until) || until <= Date.now()) {
      localStorage.removeItem(key);
      setCooldownUntil(null);
      setCooldownRemaining(0);
      return;
    }

    setCooldownUntil(until);
    setCooldownRemaining(until - Date.now());

    const interval = setInterval(() => {
      const remaining = until - Date.now();

      if (remaining <= 0) {
        localStorage.removeItem(key);
        setCooldownUntil(null);
        setCooldownRemaining(0);
        clearInterval(interval);
        return;
      }

      setCooldownRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [user?._id]);

  /*
   * If user data is not loaded yet
   */
  if (!user) {
    return (
      <StudentLayout>
        <div className="p-6 text-center">Loading...</div>
      </StudentLayout>
    );
  }

  /*
   * Handle only editable fields.
   *
   * Email, student ID and mess code are not present
   * in formData, so they cannot be changed from here.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getRemainingCooldown = () => {
    if (!cooldownUntil) return 0;
    return Math.max(0, new Date(cooldownUntil).getTime() - Date.now());
  };

  const formatCooldown = (milliseconds) => {
    const totalMinutes = Math.ceil(milliseconds / (60 * 1000));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  /*
   * Send profile update request to admin.
   *
   * Only editable fields are sent.
   */
  const handleUpdateRequest = async () => {
    const remainingCooldown = getRemainingCooldown();

    if (remainingCooldown > 0) {
      toast.error(
        `You can submit another profile update after ${formatCooldown(remainingCooldown)}.`,
      );
      return;
    }
    try {
      setLoading(true);
      setMessage("");

      /*
       * Only send fields that are allowed to be changed.
       */
      const updateData = {
        fullName: formData.fullName.trim(),
        hostelName: formData.hostelName.trim(),
        roomNumber: formData.roomNumber.trim(),
        enrolmentNumber: formData.enrolmentNumber.trim(),
        phone: formData.phone.trim(),
      };

      /*
       * Basic frontend validation
       */
      if (!updateData.fullName) {
        throw new Error("Full name is required.");
      }

      if (!updateData.hostelName) {
        throw new Error("Please select a hostel.");
      }

      if (!updateData.roomNumber) {
        throw new Error("Room number is required.");
      }

      if (!updateData.enrolmentNumber) {
        throw new Error("Enrollment number is required.");
      }

      if (!updateData.phone) {
        throw new Error("Phone number is required.");
      }

      // Check if any changes were actually made
      const hasChanges =
        updateData.fullName !== (user.fullName || "") ||
        updateData.hostelName !== (user.hostelName || "") ||
        updateData.roomNumber !== (user.roomNumber || "") ||
        updateData.enrolmentNumber !== (user.enrolmentNumber || "") ||
        updateData.phone !== (user.phone || "");
      if (!hasChanges) {
        toast.error("No profile changes were made.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("studentToken");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/student/profile-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            /*
             * Keep this uncommented if your backend requires
             * authentication.
             */
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
          body: JSON.stringify(updateData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send update request.");
      }

      const nextCooldownUntil = Date.now() + PROFILE_UPDATE_COOLDOWN_MS;
      const cooldownKey = `profileUpdateCooldown:${user._id}`;

      localStorage.setItem(cooldownKey, String(nextCooldownUntil));
      setCooldownUntil(nextCooldownUntil);
      setCooldownRemaining(PROFILE_UPDATE_COOLDOWN_MS);

      /*
       * Request successfully sent.
       */
      setRequestStatus("pending");
      toast.success("Profile update request sent for verification.");

      /*
       * Exit edit mode.
       *
       * Important:
       * We DO NOT replace user data here because the profile
       * should only change after admin approval.
       */
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update request error:", error);
      toast.error(error.message || "Unable to send update request.");
      setMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * Cancel editing.
   *
   * Restore the currently approved user details.
   * Any unapproved changes are discarded.
   */
  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || "",
      hostelName: user.hostelName || "",
      roomNumber: user.roomNumber || "",
      enrolmentNumber: user.enrolmentNumber || "",
      phone: user.phone || "",
    });

    setIsEditing(false);
    setMessage("");
  };

  /*
   * Start editing.
   */
  const handleStartEditing = () => {
    /*
     * Always load the currently approved values
     * before entering edit mode.
     */
    setFormData({
      fullName: user.fullName || "",
      hostelName: user.hostelName || "",
      roomNumber: user.roomNumber || "",
      enrolmentNumber: user.enrolmentNumber || "",
      phone: user.phone || "",
    });

    setMessage("");
    setIsEditing(true);
  };

  /*
   * Convert hostel name into display format.
   */
  const formatHostelName = (hostel) => {
    if (!hostel) return "-";

    return hostel
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <StudentLayout>
      <div className="flex w-full justify-center p-3 sm:p-4 md:p-6">
        <div className="w-full max-w-2xl min-w-0 rounded-2xl bg-white p-4 shadow-lg sm:p-6 md:p-8">
          {/* ================= HEADER ================= */}
          <h2 className="mb-6 text-center text-xl font-bold md:text-2xl">
            Student Profile
          </h2>

          {/* ================= STATUS MESSAGE ================= */}
          {message && (
            <div
              className={`mb-6 rounded-lg p-3 text-center text-sm ${
                message.toLowerCase().includes("error") ||
                message.toLowerCase().includes("required")
                  ? "bg-red-50 text-red-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* ================= PROFILE DETAILS ================= */}
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {/* ================================================= */}
            {/* FULL NAME - EDITABLE */}
            {/* ================================================= */}
            <div>
              <p className="text-sm text-gray-500">Full Name</p>

              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter full name"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2
                             outline-none focus:border-blue-500
                             focus:ring-1 focus:ring-blue-500
                             disabled:cursor-not-allowed
                             disabled:bg-gray-100"
                />
              ) : (
                <p className="text-base font-semibold md:text-lg">
                  {user.fullName || "-"}
                </p>
              )}
            </div>

            {/* ================================================= */}
            {/* EMAIL - NON EDITABLE */}
            {/* ================================================= */}
            <div>
              <p className="text-sm text-gray-500">Email</p>

              <p className="break-all text-base font-semibold md:text-lg">
                {user.email || "-"}
              </p>
            </div>

            {/* ================================================= */}
            {/* HOSTEL - EDITABLE */}
            {/* ================================================= */}
            {/* ================================================= */}
            {/* HOSTEL - EDITABLE */}
            {/* ================================================= */}
            <div className="min-w-0 w-full">
              <p className="text-sm text-gray-500">Hostel</p>

              {isEditing ? (
                <div className="mt-1 w-full min-w-0">
                  <select
                    name="hostelName"
                    value={formData.hostelName}
                    onChange={handleChange}
                    disabled={loading}
                    className="block w-full max-w-full min-w-0
                   appearance-auto
                   rounded-md border border-gray-300
                   bg-white px-3 py-2
                   text-sm sm:text-base
                   outline-none
                   focus:border-blue-500
                   focus:ring-1 focus:ring-blue-500
                   disabled:cursor-not-allowed
                   disabled:bg-gray-100
                   overflow-hidden"
                  >
                    <option value="">Select Hostel</option>

                    {Object.keys(mapHtoM).map((hostel) => (
                      <option key={hostel} value={hostel}>
                        {formatHostelName(hostel)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="break-words text-base font-semibold md:text-lg">
                  {user.hostelName ? formatHostelName(user.hostelName) : "-"}
                </p>
              )}
            </div>
            {/* ================================================= */}
            {/* ROOM NUMBER - EDITABLE */}
            {/* ================================================= */}
            <div>
              <p className="text-sm text-gray-500">Room Number</p>

              {isEditing ? (
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter room number"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2
                             outline-none focus:border-blue-500
                             focus:ring-1 focus:ring-blue-500
                             disabled:cursor-not-allowed
                             disabled:bg-gray-100"
                />
              ) : (
                <p className="text-base font-semibold md:text-lg">
                  {user.roomNumber || "-"}
                </p>
              )}
            </div>

            {/* ================================================= */}
            {/* ENROLLMENT NUMBER - EDITABLE */}
            {/* ================================================= */}
            <div>
              <p className="text-sm text-gray-500">Enrollment Number</p>

              {isEditing ? (
                <input
                  type="text"
                  name="enrolmentNumber"
                  value={formData.enrolmentNumber}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter enrollment number"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2
                             outline-none focus:border-blue-500
                             focus:ring-1 focus:ring-blue-500
                             disabled:cursor-not-allowed
                             disabled:bg-gray-100"
                />
              ) : (
                <p className="text-base font-semibold md:text-lg">
                  {user.enrolmentNumber || "-"}
                </p>
              )}
            </div>

            {/* ================================================= */}
            {/* PHONE - EDITABLE */}
            {/* ================================================= */}
            <div>
              <p className="text-sm text-gray-500">Phone</p>

              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter phone number"
                  maxLength={15}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2
                             outline-none focus:border-blue-500
                             focus:ring-1 focus:ring-blue-500
                             disabled:cursor-not-allowed
                             disabled:bg-gray-100"
                />
              ) : (
                <p className="text-base font-semibold md:text-lg">
                  {user.phone || "-"}
                </p>
              )}
            </div>

            {/* ================================================= */}
            {/* STUDENT ID - NON EDITABLE */}
            {/* ================================================= */}
            <div>
              <p className="text-sm text-gray-500">Student ID</p>

              <p className="break-all text-base font-semibold md:text-lg">
                {user._id || "-"}
              </p>
            </div>

            {/* ================================================= */}
            {/* MESS CODE - NON EDITABLE */}
            {/* ================================================= */}
            <div>
              <p className="text-sm text-gray-500">Mess Code</p>

              <p className="break-all text-base font-semibold md:text-lg">
                {user.messId?.messCode || "-"}
              </p>
            </div>
          </div>

          {/* ================= BUTTONS ================= */}
          <div className="mt-8 flex justify-center gap-3">
            {/* ================================================= */}
            {/* UPDATE PROFILE BUTTON */}
            {/* ================================================= */}
            {!isEditing ? (
              <button
                onClick={handleStartEditing}
                disabled={requestStatus === "pending" || cooldownRemaining > 0}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm
                           font-semibold text-white shadow-sm
                           transition-all duration-200
                           hover:bg-blue-700 hover:shadow-md
                           focus:outline-none focus:ring-2
                           focus:ring-blue-500 focus:ring-offset-2
                           active:scale-95
                           disabled:cursor-not-allowed
                           disabled:opacity-50"
              >
                {requestStatus === "pending"
                  ? "Verification Pending"
                  : cooldownRemaining > 0
                    ? `Available in ${formatCooldown(cooldownRemaining)}`
                    : "Update Profile"}
              </button>
            ) : (
              <>
                {/* ================= CANCEL ================= */}
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-6 py-2.5
                             text-sm font-semibold text-gray-700
                             transition hover:bg-gray-100
                             disabled:cursor-not-allowed
                             disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* ================= SEND REQUEST ================= */}
                <button
                  onClick={handleUpdateRequest}
                  disabled={loading || cooldownRemaining > 0}
                  className="rounded-lg bg-blue-600 px-6 py-2.5
                             text-sm font-semibold text-white
                             shadow-sm transition-all duration-200
                             hover:bg-blue-700 hover:shadow-md
                             focus:outline-none focus:ring-2
                             focus:ring-blue-500 focus:ring-offset-2
                             active:scale-95
                             disabled:cursor-not-allowed
                             disabled:opacity-50"
                >
                  {loading
                    ? "Sending..."
                    : "Send for Verification"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
