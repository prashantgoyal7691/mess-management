import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";

export default function MyFeedbacks() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("studentToken");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/feedback/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <h1 className="text-xl md:text-3xl font-bold mb-6">
          My Feedback History
        </h1>

        {data.length === 0 ? (
          <p className="text-gray-500">No feedback submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.map((item) => (
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
