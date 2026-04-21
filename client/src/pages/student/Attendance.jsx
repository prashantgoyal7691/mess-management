import StudentLayout from "../../layouts/StudentLayout";
import { useEffect, useState } from "react";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [bill, setBill] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user =
      storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

    if (!user?._id) return;

    const fetchAttendance = async () => {
      try {
        const monthString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/meal/monthly?userId=${user._id}&month=${monthString}`,
        );

        const data = await res.json();

        if (!Array.isArray(data)) {
          setBill(0);
          return;
        }

        const daysMap = {};

        const daysInMonth = new Date(
          selectedYear,
          selectedMonth + 1,
          0,
        ).getDate();

        data.forEach((item) => {
          const day = parseInt(item.date.split("-")[2]);

          if (!daysMap[day]) {
            daysMap[day] = {
              day,
              breakfast: false,
              lunch: false,
              dinner: false,
            };
          }

          daysMap[day][item.meal] = item.status === "eat";
        });

        const fullMonth = [];
        const today = new Date(
          new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        );
        // today.setDate(today.getDate() + 1);

        const isCurrentMonth =
          selectedMonth === today.getMonth() &&
          selectedYear === today.getFullYear();

        for (let day = 1; day <= daysInMonth; day++) {
          const isFuture = isCurrentMonth && day > today.getDate();

          fullMonth.push({
            day,
            isFuture, // 👈 store it here
            breakfast: !isFuture && (daysMap[day]?.breakfast || false),
            lunch: !isFuture && (daysMap[day]?.lunch || false),
            dinner: !isFuture && (daysMap[day]?.dinner || false),
          });
        }

        setAttendance(fullMonth);
      } catch (err) {
        console.log("Error fetching attendance", err);
      }
    };

    const fetchBill = async () => {
      try {
        const token = localStorage.getItem("studentToken");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/billing/my-dynamic`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        const monthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;

        const today = new Date(
          new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        );
        today.setHours(0, 0, 0, 0);

        const filtered = data.filter((b) => {
          if (!b.date.startsWith(monthKey)) return false;

          const billDate = new Date(b.date);
          billDate.setHours(0, 0, 0, 0);

          return billDate <= today; // ✅ only upto today
        });

        let total = 0;

        filtered.forEach((b) => {
          total += b.total;
        });

        setBill(parseFloat(total.toFixed(2)));
      } catch (err) {
        console.log("Error fetching bill", err);
      }
    };

    fetchAttendance();
    fetchBill();
  }, [selectedMonth, selectedYear]);

  return (
    <StudentLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          📊 Monthly Attendance ({months[selectedMonth]} {selectedYear})
        </h1>

        <div className="flex gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border p-2 rounded"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border p-2 rounded w-24"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          Breakfast
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          Lunch
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          Dinner
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
        <div className="flex items-end gap-5 h-64">
          {attendance.map((item) => (
            <div key={item.day} className="flex flex-col items-center">
              {/* Bars */}
              <div className="flex flex-col-reverse items-center gap-0">
                {item.breakfast && (
                  <div className="w-1 h-6 bg-red-500 rounded"></div>
                )}
                {item.lunch && (
                  <div className="w-1 h-6 bg-yellow-400 rounded"></div>
                )}
                {item.dinner && (
                  <div className="w-1 h-6 bg-green-500 rounded"></div>
                )}
              </div>

              {/* Day */}
              <span
                className={`mt-2 text-sm ${
                  item.isFuture ? "text-gray-300" : ""
                }`}
              >
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bill */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">💰 Monthly Bill</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="col-span-2 font-bold text-lg mt-2">
            Total Bill: ₹{bill}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
