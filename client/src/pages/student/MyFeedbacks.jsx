import { useEffect } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { useAuthStore } from "../../stores/authStore";
import { useFeedbackStore } from "../../stores/feedbackStore";

export default function MyFeedbacks() {
  const token = useAuthStore((state) => state.studentToken);

  const feedbacks = useFeedbackStore((state) => state.feedbacks);
  const loading = useFeedbackStore((state) => state.loading);
  const error = useFeedbackStore((state) => state.error);
  const fetchMyFeedbacks = useFeedbackStore(
    (state) => state.fetchMyFeedbacks,
  );

  useEffect(() => {
    fetchMyFeedbacks(token);
  }, [token, fetchMyFeedbacks]);

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <h1 className="text-xl md:text-3xl font-bold mb-6">
          My Feedback History
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading feedbacks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedback submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedbacks.map((item) => (
              <div
                key={item._id}
                className="bg-white border rounded-lg p-3 md:p-4 mb-4 shadow"
              >
                {/* Date */}
                <p className="text-sm text-gray-500 mb-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>

                <p className="text-xs text-gray-500 mb-1">🍽 {item.type}</p>
                <p className="font-medium text-sm md:text-base">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
