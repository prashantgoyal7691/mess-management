import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";

const getISTDate = (date = new Date()) => {
  return new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  ).toLocaleDateString("en-CA");
};

export default function StudentHistory() {
  const { id } = useParams();
  const [meals, setMeals] = useState([]);
  const [student, setStudent] = useState(null);
  const [month, setMonth] = useState(() => {
    return getISTDate().slice(0, 7);
  });

  useEffect(() => {
    const fetchHistory = async () => {
      const url = month
        ? `${import.meta.env.VITE_API_URL}/api/admin/student-history/${id}?month=${month}`
        : `${import.meta.env.VITE_API_URL}/api/admin/student-history/${id}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      const data = await res.json();
      setMeals(Array.isArray(data) ? data : []);

      if (Array.isArray(data) && data.length > 0) {
        setStudent({
          name: data[0].name,
          enrolment: data[0].enrolment,
        });
      }
    };

    fetchHistory();
  }, [id, month]);

  const totalMonthBill = meals.reduce((sum, m) => sum + m.total, 0);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">📊 Student Meal History</h1>
      {student && (
        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <h2 className="text-xl font-bold">👤 {student.name}</h2>
          <p className="text-gray-600">🎓 {student.enrolment}</p>
        </div>
      )}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2 rounded mb-4"
      />

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Date</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Dinner</th>
            <th>Total ₹</th>
          </tr>
        </thead>

        <tbody>
          {meals.map((m, i) => (
            <tr key={i} className="border-t text-center">
              <td>{m.date}</td>

              <td className="text-center">₹{m.breakfast}</td>

              <td className="text-center">₹{m.lunch}</td>

              <td className="text-center">₹{m.dinner}</td>

              <td className="font-bold">₹{m.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right text-xl font-bold">
        Total Monthly Bill: ₹{totalMonthBill}
      </div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={async () => {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/admin/student-history-pdf/${id}?month=${month}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              },
            },
          );

          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = `report-${month}.pdf`;
          a.click();
        }}
      >
        📄 Download PDF
      </button>
    </AdminLayout>
  );
}
