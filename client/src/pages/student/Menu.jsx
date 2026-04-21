import StudentLayout from "../../layouts/StudentLayout";
import { useState, useEffect } from "react";

const getISTDate = (date = new Date()) => {
  return new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  ).toLocaleDateString("en-CA");
};

export default function Menu() {
  const [menus, setMenus] = useState({});
  const [plans, setPlans] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  // 🔥 Generate 7 days
  const getDates = () => {
    const arr = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      arr.push({
        day: d.toLocaleDateString("en-US", { weekday: "long" }),
        date: getISTDate(d), // ✅ FIXED
        displayDate: d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
      });
    }

    return arr;
  };

  const dates = getDates();

  // 🔥 Load menu from admin
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const newMenus = {};

        const dates = getDates(); // 🔥 MOVE HERE

        for (const item of dates) {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/admin/menu/student?day=${item.day}&messId=${user.messId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const data = await res.json();

          console.log("MENU FETCH:", item.date, data); // 🔥 DEBUG

          if (data) {
            newMenus[item.date] = data;
          }
        }

        setMenus(newMenus);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMenus();
  }, []);

  // 🔥 Load student selections
  useEffect(() => {
    const fetchPlans = async () => {
      if (!user?._id) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/meal/my?userId=${user._id}`,
        );
        const data = await res.json();

        const formatted = {};
        data.forEach((plan) => {
          const key = `${plan.date}-${plan.meal}`;
          formatted[key] = plan.status;
        });

        setPlans(formatted);
        setIsLoaded(true);
      } catch (err) {
        console.log("Error loading plans", err);
      }
    };

    fetchPlans();
  }, []);

  // 🔒 lock logic
  const isLocked = (date) => {
    const today = new Date(getISTDate());
    const mealDate = new Date(date + "T00:00:00");

    today.setHours(0, 0, 0, 0);
    mealDate.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return mealDate <= tomorrow;
  };

  // 🔁 toggle
  const toggleMeal = async (date, meal) => {
    if (isLocked(date)) return;

    const key = `${date}-${meal}`;
    const newStatus = plans[key] === "eat" ? "skip" : "eat";

    setPlans({
      ...plans,
      [key]: newStatus,
    });

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/meal/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          date,
          meal,
          status: newStatus,
        }),
      });
    } catch (err) {
      console.log("Error saving plan", err);
    }
  };

  return (
    <StudentLayout>
      <h1 className="text-3xl font-bold mb-6">🍽️ Weekly Menu</h1>

      <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Day</th>
              <th className="p-3">Breakfast</th>
              <th className="p-3">Lunch</th>
              <th className="p-3">Dinner</th>
            </tr>
          </thead>

          <tbody>
            {dates.map((item) => (
              <tr key={item.date} className="border-t hover:bg-gray-100">
                <td className="p-3 font-medium">
                  <div>{item.day}</div>
                  <div className="text-sm text-gray-500">
                    {item.displayDate}
                  </div>
                </td>

                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <td key={meal} className="p-3">
                    <div
                      className={`flex items-center justify-between ${
                        isLocked(item.date)
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() => toggleMeal(item.date, meal)}
                    >
                      <div>
                        <span className="block break-words whitespace-normal max-w-[200px]">
                          {menus[item.date]?.[meal] || "Not set"}
                        </span>
                        <div className="text-xs text-gray-400">
                          {item.displayDate}
                        </div>
                      </div>

                      <span className="text-lg">
                        {plans[`${item.date}-${meal}`] === "skip" ? "❌" : "✅"}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StudentLayout>
  );
}
