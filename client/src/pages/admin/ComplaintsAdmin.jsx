import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAuthStore } from "../../stores/authStore";
import { useComplaintStore } from "../../stores/complaintStore";

export default function ComplaintsAdmin() {
  const [updates, setUpdates] = useState({});

  const token = useAuthStore((state) => state.adminToken);
  const complaints = useComplaintStore(
    (state) => state.adminComplaints
  );
  const loading = useComplaintStore(
    (state) => state.adminComplaintsLoading
  );
  const updating = useComplaintStore(
    (state) => state.adminComplaintsUpdating
  );
  const error = useComplaintStore(
    (state) => state.adminComplaintsError
  );
  const fetchAdminComplaints = useComplaintStore(
    (state) => state.fetchAdminComplaints
  );
  const updateAdminComplaint = useComplaintStore(
    (state) => state.updateAdminComplaint
  );

  useEffect(() => {
    fetchAdminComplaints(token);
  }, [token, fetchAdminComplaints]);

  const handleChange = (id, field, value) => {
    setUpdates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (id) => {
    try {
      await updateAdminComplaint(
        token,
        id,
        updates[id] || {},
      );

      setUpdates((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4 ">Complaints</h1>
        {!loading && complaints.length === 0 && (
          <div className="text-center p-6 text-gray-500">
            No complaints found.
          </div>
        )}
        {error && (
          <div className="text-center p-4 text-red-500">
            {error}
          </div>
        )}

        {complaints.map((item) => (
          <div key={item._id} className="bg-white p-4 md:p-5 rounded-lg shadow mb-4">
            <p className="font-bold">
              {item.userId?.fullName || "Unknown"} (
              {item.userId?.enrolmentNumber || "-"})
            </p>

            <p className="text-sm text-gray-500">
              {item.category} • {item.date}
            </p>

            <p className="mt-2 font-medium">{item.title}</p>
            <p className="text-gray-600">{item.description}</p>

            <select
              value={updates[item._id]?.status || item.status}
              onChange={(e) => handleChange(item._id, "status", e.target.value)}
              className="mt-3 border p-2 rounded w-full md:w-auto"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <textarea
              placeholder="Write reply..."
              value={updates[item._id]?.reply || item.reply}
              onChange={(e) => handleChange(item._id, "reply", e.target.value)}
              className="w-full border p-2 rounded mt-2 text-sm md:text-base"
            />

            <button
              onClick={() => handleUpdate(item._id)}
              disabled={updating}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
