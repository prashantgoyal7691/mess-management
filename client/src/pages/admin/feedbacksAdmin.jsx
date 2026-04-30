import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function FeedbacksAdmin() {
  const [data, setData] = useState([]);
  const [openDate, setOpenDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/feedback/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await res.json();

      const groupedByDate = {};

      result.forEach((item) => {
        const date = item.createdAt.split("T")[0]; // YYYY-MM-DD

        if (!groupedByDate[date]) {
          groupedByDate[date] = [];
        }

        groupedByDate[date].push(item);
      });

      // Convert to array + sort latest first
      const finalData = Object.entries(groupedByDate).sort(
        (a, b) => new Date(b[0]) - new Date(a[0]),
      );

      setData(finalData);
    };

    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Feedbacks</h1>

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
