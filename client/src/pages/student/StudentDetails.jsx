import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { useAuthStore } from "../../stores/authStore";
import { useProfileUpdateStore } from "../../stores/profileUpdateStore";

export default function StudentDetails() {
  const user = useAuthStore((state) => state.user);
  const studentToken = useAuthStore((state) => state.studentToken);
  const refreshStudentProfile = useAuthStore(
    (state) => state.refreshStudentProfile,
  );

  const loading = useProfileUpdateStore(
    (state) => state.loading,
  );

  const requestStatus = useProfileUpdateStore(
    (state) => state.requestStatus,
  );

  const createRequest = useProfileUpdateStore(
    (state) => state.createRequest,
  );

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    hostelName: "",
    roomNumber: "",
    enrolmentNumber: "",
    phone: "",
  });

  const mapHtoM = {
    "pg hostel": "pg hostel mess",
    "jhelum hostel": "jhelum mess",
    "jhelum extension hostel": "jhelum extension mess",
    "indus hostel": "indus mess",
    "chenab hostel": "chenab mess",
    "girls hostel": "girls mess",
  };

  useEffect(() => {
    if (!user) return;

    setFormData({
      fullName: user.fullName || "",
      hostelName: user.hostelName || "",
      roomNumber: user.roomNumber || "",
      enrolmentNumber: user.enrolmentNumber || "",
      phone: user.phone || "",
    });
  }, [user]);

  if (!user) {
    return (
      <StudentLayout>
        <div className="p-6 text-center">
          Loading...
        </div>
      </StudentLayout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartEditing = () => {
    setFormData({
      fullName: user.fullName || "",
      hostelName: user.hostelName || "",
      roomNumber: user.roomNumber || "",
      enrolmentNumber: user.enrolmentNumber || "",
      phone: user.phone || "",
    });

    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || "",
      hostelName: user.hostelName || "",
      roomNumber: user.roomNumber || "",
      enrolmentNumber: user.enrolmentNumber || "",
      phone: user.phone || "",
    });

    setIsEditing(false);
  };

  const handleUpdateRequest = async () => {
    const updateData = {
      fullName: formData.fullName.trim(),
      hostelName: formData.hostelName.trim(),
      roomNumber: formData.roomNumber.trim(),
      enrolmentNumber: formData.enrolmentNumber.trim(),
      phone: formData.phone.trim(),
    };

    if (!updateData.fullName) {
      toast.error("Full name is required.");
      return;
    }

    if (!updateData.hostelName) {
      toast.error("Please select a hostel.");
      return;
    }

    if (!updateData.roomNumber) {
      toast.error("Room number is required.");
      return;
    }

    if (!updateData.enrolmentNumber) {
      toast.error("Enrollment number is required.");
      return;
    }

    if (!updateData.phone) {
      toast.error("Phone number is required.");
      return;
    }

    const hasChanges =
      updateData.fullName !== (user.fullName || "") ||
      updateData.hostelName !== (user.hostelName || "") ||
      updateData.roomNumber !== (user.roomNumber || "") ||
      updateData.enrolmentNumber !==
      (user.enrolmentNumber || "") ||
      updateData.phone !== (user.phone || "");

    if (!hasChanges) {
      toast.error("No profile changes were made.");
      return;
    }

    try {
      await createRequest(
        studentToken,
        updateData,
      );
      toast.success(
        "Profile update request sent for verification.",
      );

      setIsEditing(false);
    } catch (err) {
      toast.error(
        err.message ||
        "Unable to send profile update request.",
      );
    }
  };

  const formatHostelName = (hostel) => {
    if (!hostel) return "-";

    return hostel
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1),
      )
      .join(" ");
  };
  const isPending =
    requestStatus === "pending" ||
    user?.pendingProfileUpdate?.status === "pending";
  return (
    <StudentLayout>
      <div className="flex w-full justify-center p-3 sm:p-4 md:p-6">
        <div className="w-full max-w-2xl min-w-0 rounded-2xl bg-white p-4 shadow-lg sm:p-6 md:p-8">
          <h2 className="mb-6 text-center text-xl font-bold md:text-2xl">
            Student Profile
          </h2>

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div>
              <p className="text-sm text-gray-500">
                Full Name
              </p>

              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter full name"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              ) : (
                <p className="text-base font-semibold md:text-lg">
                  {user.fullName || "-"}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="break-all text-base font-semibold md:text-lg">
                {user.email || "-"}
              </p>
            </div>

            <div className="min-w-0 w-full">
              <p className="text-sm text-gray-500">
                Hostel
              </p>

              {isEditing ? (
                <select
                  name="hostelName"
                  value={formData.hostelName}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-1 block w-full min-w-0 max-w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-base"
                >
                  <option value="">
                    Select Hostel
                  </option>

                  {Object.keys(mapHtoM).map(
                    (hostel) => (
                      <option
                        key={hostel}
                        value={hostel}
                      >
                        {formatHostelName(hostel)}
                      </option>
                    ),
                  )}
                </select>
              ) : (
                <p className="break-words text-base font-semibold md:text-lg">
                  {user.hostelName
                    ? formatHostelName(
                      user.hostelName,
                    )
                    : "-"}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Room Number
              </p>

              {isEditing ? (
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter room number"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              ) : (
                <p className="text-base font-semibold md:text-lg">
                  {user.roomNumber || "-"}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Enrollment Number
              </p>

              {isEditing ? (
                <input
                  type="text"
                  name="enrolmentNumber"
                  value={formData.enrolmentNumber}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter enrollment number"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              ) : (
                <p className="text-base font-semibold md:text-lg">
                  {user.enrolmentNumber || "-"}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter phone number"
                  maxLength={15}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              ) : (
                <p className="text-base font-semibold md:text-lg">
                  {user.phone || "-"}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Student ID
              </p>

              <p className="break-all text-base font-semibold md:text-lg">
                {user._id || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Mess Code
              </p>

              <p className="break-all text-base font-semibold md:text-lg">
                {user.messId?.messCode || "-"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            {!isEditing ? (
              <button
                onClick={handleStartEditing}
                disabled={isPending}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending
                  ? "Verification Pending"
                  : "Update Profile"}
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateRequest}
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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