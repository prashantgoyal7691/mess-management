import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

const getISTDate = (date = new Date()) => {
  return new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  ).toLocaleDateString("en-CA");
};

export default function SetExpense() {
  const [breakfastCost, setBreakfastCost] = useState("");
  const [lunchCost, setLunchCost] = useState("");
  const [dinnerCost, setDinnerCost] = useState("");
  const navigate = useNavigate();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = getISTDate(tomorrow);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/billing/set-expense`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            breakfastCost,
            lunchCost,
            dinnerCost,
          }),
        },
      );

      const data = await res.json();

      alert("Expense saved for tomorrow");
    } catch (err) {
      console.log(err);
      alert("Error saving expense");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto p-4 md:p-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/admin/expense-history")}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm"
          >
            View Expense History
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-xl md:text-3xl font-bold">
            Set Expense for {date}
          </h1>

          
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow space-y-4">
          <input
            type="number"
            placeholder="Breakfast Cost"
            value={breakfastCost}
            onChange={(e) => setBreakfastCost(e.target.value)}
            className="w-full border p-2 md:p-3 rounded text-sm md:text-base"
          />

          <input
            type="number"
            placeholder="Lunch Cost"
            value={lunchCost}
            onChange={(e) => setLunchCost(e.target.value)}
            className="w-full border p-2 md:p-3 rounded text-sm md:text-base"
          />

          <input
            type="number"
            placeholder="Dinner Cost"
            value={dinnerCost}
            onChange={(e) => setDinnerCost(e.target.value)}
            className="w-full border p-2 md:p-3 rounded text-sm md:text-base"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Save Expense
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
