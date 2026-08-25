import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAuthStore } from "../../stores/authStore";
import { useFeedbackStore } from "../../stores/feedbackStore";

export default function FeedbacksAdmin() {
  const [openDate, setOpenDate] = useState(null);

  const token = useAuthStore((state) => state.adminToken);

  const feedbacks = useFeedbackStore(
    (state) => state.adminFeedbacks
  );

  const groupedByDate = {};

  feedbacks.forEach((item) => {
    const date = item.createdAt.split("T")[0];

    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }

    groupedByDate[date].push(item);
  });

  const data = Object.entries(groupedByDate).sort(
    (a, b) => new Date(b[0]) - new Date(a[0]),
  );

  const loading = useFeedbackStore(
    (state) => state.adminFeedbacksLoading
  );

  const error = useFeedbackStore(
    (state) => state.adminFeedbacksError
  );

  const fetchAdminFeedbacks = useFeedbackStore(
    (state) => state.fetchAdminFeedbacks
  );

  useEffect(() => {
    fetchAdminFeedbacks(token);
  }, [token, fetchAdminFeedbacks]);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Feedbacks</h1>
        {!loading && data.length === 0 && (
          <div className="text-center p-6 text-gray-500">
            No feedbacks found.
          </div>
        )}

        {error && (
          <div className="text-center p-4 text-red-500">
            {error}
          </div>
        )}

        {data.map(([date, feedbacks]) => (
          <div key={date} className="mb-4 border rounded">
            {/* Date Header */}
            <div
              onClick={() => setOpenDate(openDate === date ? null : date)}
              className="cursor-pointer p-3 bg-gray-100 font-semibold flex flex-col sm:flex-row sm:justify-between gap-1"
            >
              <span>{date}</span>
              <span>({feedbacks.length})</span>
            </div>

            {/* Expand */}
            {openDate === date && (
              <div className="p-3 space-y-3 md:space-y-4">
                {feedbacks.map((item) => (
                  <div
                    key={item._id}
                    className="border p-3 rounded text-sm md:text-base"
                  >
                    <p className="font-medium">
                      {item.userId?.fullName || "Unknown"} (
                      {item.userId?.enrolmentNumber || "-"})
                    </p>

                    <p className="text-xs text-gray-500 mb-1">{item.type}</p>
                    <p>{item.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
