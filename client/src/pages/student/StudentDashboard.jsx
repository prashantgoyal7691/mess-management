import StudentLayout from "../../layouts/StudentLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const today = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();
  return (
    <StudentLayout>
      <h1 className="text-xl md:text-3xl font-bold mb-6 px-4 md:px-0">Student Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
        <div
          onClick={() => navigate("/student/attendance")}
          className="bg-white p-4 md:p-5 rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <h2 className="text-lg font-semibold">📸 Attendance</h2>
          <p className="text-gray-500 mt-2">View your attendance</p>
        </div>

        <div
          onClick={() => navigate("/student/feedback")}
          className="bg-white p-4 md:p-5 rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <h2 className="text-lg font-semibold">⭐ Feedback</h2>
          <p className="text-gray-500 mt-2">Rate your meals</p>
        </div>
        <div
          onClick={() => navigate("/student/details")}
          className="bg-white p-4 md:p-5 rounded-xl shadow hover:shadow-lg cursor-pointer"
        >
          <h2 className="text-lg font-semibold">👤 Student Details</h2>
          <p className="text-gray-500 mt-2">View your profile details</p>
        </div>
      </div>
    </StudentLayout>
  );
}
