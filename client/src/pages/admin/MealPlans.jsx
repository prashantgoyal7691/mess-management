import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";

const getISTDate = (date = new Date()) => {
  return new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  ).toLocaleDateString("en-CA");
};

export default function MealPlans() {
  const [menu, setMenu] = useState({});

  // 🔥 Generate next 7 days (dynamic UI)
  const getDates = () => {
    const arr = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      arr.push({
        date: getISTDate(d),
        day: d.toLocaleDateString("en-US", { weekday: "long" }),
        display: d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
      });
    }

    return arr;
  };

  const [dates] = useState(getDates());

  // 🔥 Fetch menu (day-based → map to date)
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const newMenu = {};

        for (const item of dates) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/admin/menu?day=${item.day}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const data = res.data || {};

          newMenu[`${item.date}-breakfast`] = data.breakfast || "";
          newMenu[`${item.date}-lunch`] = data.lunch || "";
          newMenu[`${item.date}-dinner`] = data.dinner || "";
        }

        setMenu(newMenu);
      } catch (err) {
        console.log("FETCH MENU ERROR:", err);
      }
    };

    fetchMenus();
  }, [dates]);

  const isEditable = (date) => {
    const today = new Date(getISTDate());
    const d = new Date(date + "T00:00:00");

    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);

    const tomorrow = new Date(getISTDate());
    tomorrow.setDate(tomorrow.getDate() + 1);

    return d > tomorrow; // ✅ only after tomorrow editable
  };

  // 🔁 Handle change (date-based state)
  const handleChange = (date, meal, value) => {
    setMenu((prev) => ({
      ...prev,
      [`${date}-${meal}`]: value,
    }));
  };

  // 💾 Save menu (convert date → day)
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      for (const item of dates) {
        if (!isEditable(item.date)) continue;

        const breakfast = menu[`${item.date}-breakfast`];
        const lunch = menu[`${item.date}-lunch`];
        const dinner = menu[`${item.date}-dinner`];

        if (!breakfast && !lunch && !dinner) continue; // 🔥 skip empty

        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/menu`,
          {
            day: item.day,
            breakfast: menu[`${item.date}-breakfast`] || "",
            lunch: menu[`${item.date}-lunch`] || "",
            dinner: menu[`${item.date}-dinner`] || "",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      alert("Weekly menu saved successfully!");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Error saving menu");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">🍽 Weekly Menu Planner</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="p-3 border">Day</th>
              <th className="p-3 border">Breakfast</th>
              <th className="p-3 border">Lunch</th>
              <th className="p-3 border">Dinner</th>
            </tr>
          </thead>

          <tbody>
            {dates.map((item) => (
              <tr key={item.date} className="text-center">
                <td className="border p-3 font-semibold">
                  <div>{item.day}</div>
                  <div className="text-sm text-gray-500">{item.display}</div>
                </td>

                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <td key={meal} className="border p-3">
                    <textarea
                      value={menu[`${item.date}-${meal}`] || ""}
                      onChange={(e) =>
                        handleChange(item.date, meal, e.target.value)
                      }
                      disabled={!isEditable(item.date)}
                      rows={2}
                      className={`border p-2 w-full resize-none break-words whitespace-normal ${
                        !isEditable(item.date)
                          ? "bg-gray-200 cursor-not-allowed"
                          : ""
                      }`}
                      placeholder={`Enter ${meal}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
        >
          Save Weekly Menu
        </button>
      </div>
    </AdminLayout>
  );
}
