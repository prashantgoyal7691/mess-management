import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("studentToken");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/complaint/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "in-progress") return "bg-blue-100 text-blue-700";
    if (status === "resolved") return "bg-green-100 text-green-700";
  };

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <h1 className="text-xl md:text-3xl font-bold mb-6">My Complaints</h1>

        {complaints.length === 0 ? (
          <p className="text-gray-500">No complaints submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {complaints.map((item) => (
              <div
                key={item._id}
                className="bg-white border rounded-lg p-4 md:p-5 mb-4 shadow"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                  <p className="font-medium text-sm md:text-base">{item.category}</p>

                  <span
                    className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Date */}
                <p className="text-sm text-gray-500 mb-2">
                  {item.date}
                </p>

                {/* Title */}
                <p className="font-medium text-sm md:text-base">{item.title}</p>

                {/* Description */}
                <p className="text-gray-600">{item.description}</p>

                {/* Reply */}
                {item.reply && (
                  <div className="mt-3 p-3 bg-gray-100 rounded">
                    <p className="text-sm font-medium">Admin Reply:</p>
                    <p className="text-sm text-gray-700">{item.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}