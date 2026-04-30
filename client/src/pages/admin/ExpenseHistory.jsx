import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function ExpenseHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/billing/expense-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.log("Error fetching history", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-3xl font-bold mb-6">
          Expense History
        </h1>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Breakfast</th>
                <th className="p-3 text-left">Lunch</th>
                <th className="p-3 text-left">Dinner</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.date} className="border-t hover:bg-gray-50">
                    {/* Date */}
                    <td className="p-3 font-medium">{item.date}</td>

                    {/* Breakfast */}
                    <td className="p-3">
                      <div>₹{item.breakfastCost}</div>
                      <div className="text-xs text-gray-500">
                        👥 {item.breakfastCount}
                      </div>
                    </td>

                    {/* Lunch */}
                    <td className="p-3">
                      <div>₹{item.lunchCost}</div>
                      <div className="text-xs text-gray-500">
                        👥 {item.lunchCount}
                      </div>
                    </td>

                    {/* Dinner */}
                    <td className="p-3">
                      <div>₹{item.dinnerCost}</div>
                      <div className="text-xs text-gray-500">
                        👥 {item.dinnerCount}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* <button
          onClick={async () => {
            try {
              const token = localStorage.getItem("adminToken");

              const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/billing/run-lock`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              const data = await res.json();
              alert(data.message);
            } catch (err) {
              console.log(err);
            }
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
        >
          Run Lock Now
        </button> */}
      </div>
    </AdminLayout>
  );
}
