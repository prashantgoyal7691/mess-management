import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

const getISTDate = (date = new Date()) => {
  return new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  ).toLocaleDateString("en-CA");
};

export default function SetExpense() {
  const [breakfastCost, setBreakfastCost] = useState("");
  const [lunchCost, setLunchCost] = useState("");
  const [dinnerCost, setDinnerCost] = useState("");

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
        }
      );

      const data = await res.json();

      alert("Expense saved for tomorrow ✅");
    } catch (err) {
      console.log(err);
      alert("Error saving expense");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          💰 Set Expense for {date}
        </h1>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <input
            type="number"
            placeholder="Breakfast Cost"
            value={breakfastCost}
            onChange={(e) => setBreakfastCost(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Lunch Cost"
            value={lunchCost}
            onChange={(e) => setLunchCost(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Dinner Cost"
            value={dinnerCost}
            onChange={(e) => setDinnerCost(e.target.value)}
            className="w-full border p-3 rounded"
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