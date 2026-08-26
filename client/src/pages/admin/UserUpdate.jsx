import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function UserUpdate() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/profile-update-requests`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

       const contentType = res.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
        const text = await res.text();

        console.error("NON-JSON RESPONSE:", text);

        throw new Error(
            `Server returned non-JSON response (${res.status}). Check VITE_API_URL and backend route.`
        );
        }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to fetch update requests"
        );
      }

      setRequests(data.requests || []);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (studentId) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this profile update?"
    );

    if (!confirmApprove) return;

    try {
      setProcessingId(studentId);
      setMessage("");

      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/profile-update-requests/${studentId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to approve update"
        );
      }

      // Remove approved request from page
      setRequests((prev) =>
        prev.filter((item) => item._id !== studentId)
      );

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong. Please try again.");
      setMessage(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (studentId) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this profile update?"
    );

    if (!confirmReject) return;

    try {
      setProcessingId(studentId);
      setMessage("");

      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/profile-update-requests/${studentId}/reject`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to reject update"
        );
      }

      // Remove rejected request from page
      setRequests((prev) =>
        prev.filter((item) => item._id !== studentId)
      );

      toast.success("Profile update rejected. Previous details remain unchanged.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong. Please try again.");
      setMessage(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const formatHostel = (hostel) => {
    if (!hostel) return "-";

    return hostel
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <p className="text-gray-500">
            Loading update requests...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full p-4 md:p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            User Update
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review student profile update requests
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mb-5 rounded-lg bg-blue-50 p-3 text-center text-sm text-blue-700">
            {message}
          </div>
        )}

        {/* NO REQUEST */}
        {requests.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-md">
            <p className="text-gray-500">
              No pending profile update requests.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {requests.map((student) => {
              const pending = student.pendingProfileUpdate;

              const isProcessing =
                processingId === student._id;

              return (
                <div
                  key={student._id}
                  className="w-full overflow-hidden rounded-2xl bg-white shadow-md"
                >


                  <div className="border-b bg-gray-50 p-4 md:p-5">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                      <div>
                        <h2 className="text-lg font-bold text-gray-800 md:text-xl">
                          {student.fullName || "-"}
                        </h2>

                        <p className="break-all text-sm text-gray-500">
                          {student.email || "-"}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="p-4 md:p-6">

                    <h3 className="mb-4 text-base font-bold text-gray-800">
                      Requested Details
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                      {/* FULL NAME */}
                      <div>
                        <label className="text-sm text-gray-500">
                          Full Name
                        </label>

                        <div className="mt-1 rounded-lg border bg-gray-50 px-3 py-2">
                          <p className="break-words text-sm font-semibold text-gray-800 md:text-base">
                            {pending?.fullName || "-"}
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          Current: {student.fullName || "-"}
                        </p>
                      </div>

                      {/* EMAIL */}
                      <div>
                        <label className="text-sm text-gray-500">
                          Email
                        </label>

                        <div className="mt-1 rounded-lg border bg-gray-100 px-3 py-2">
                          <p className="break-all text-sm font-semibold text-gray-600 md:text-base">
                            {student.email || "-"}
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          Non-editable
                        </p>
                      </div>

                      {/* HOSTEL */}
                      <div>
                        <label className="text-sm text-gray-500">
                          Hostel
                        </label>

                        <div className="mt-1 rounded-lg border bg-gray-50 px-3 py-2">
                          <p className="break-words text-sm font-semibold text-gray-800 md:text-base">
                            {formatHostel(
                              pending?.hostelName
                            )}
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          Current:{" "}
                          {formatHostel(
                            student.hostelName
                          )}
                        </p>
                      </div>

                      {/* ROOM */}
                      <div>
                        <label className="text-sm text-gray-500">
                          Room Number
                        </label>

                        <div className="mt-1 rounded-lg border bg-gray-50 px-3 py-2">
                          <p className="text-sm font-semibold text-gray-800 md:text-base">
                            {pending?.roomNumber || "-"}
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          Current:{" "}
                          {student.roomNumber || "-"}
                        </p>
                      </div>

                      {/* ENROLLMENT */}
                      <div>
                        <label className="text-sm text-gray-500">
                          Enrollment Number
                        </label>

                        <div className="mt-1 rounded-lg border bg-gray-50 px-3 py-2">
                          <p className="break-all text-sm font-semibold text-gray-800 md:text-base">
                            {pending?.enrolmentNumber ||
                              "-"}
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          Current:{" "}
                          {student.enrolmentNumber ||
                            "-"}
                        </p>
                      </div>

                      {/* PHONE */}
                      <div>
                        <label className="text-sm text-gray-500">
                          Phone
                        </label>

                        <div className="mt-1 rounded-lg border bg-gray-50 px-3 py-2">
                          <p className="break-all text-sm font-semibold text-gray-800 md:text-base">
                            {pending?.phone || "-"}
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          Current:{" "}
                          {student.phone || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:justify-end md:p-5">

                    {/* REJECT */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleReject(student._id)
                      }
                      className="w-full rounded-lg border border-red-300 px-6 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      {isProcessing
                        ? "Processing..."
                        : "Reject"}
                    </button>

                    {/* APPROVE */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleApprove(student._id)
                      }
                      className="w-full rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      {isProcessing
                        ? "Processing..."
                        : "Approve"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}