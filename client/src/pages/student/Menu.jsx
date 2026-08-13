import StudentLayout from "../../layouts/StudentLayout";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useSystemStore } from "../../stores/systemStore";
import { useMenuStore } from "../../stores/menuStore";


export default function Menu() {
  const token = useAuthStore((state) => state.studentToken);
  const serverDate = useSystemStore((state) => state.today);
  const lockDate = useSystemStore((state) => state.lockDate);

  const menus = useMenuStore((state) => state.menus);
  const menuLoading = useMenuStore((state) => state.loading);
  const menuError = useMenuStore((state) => state.error);
  const fetchMenu = useMenuStore((state) => state.fetchMenu);
  const plans = useMenuStore((state) => state.plans);
  const plansLoading = useMenuStore((state) => state.plansLoading);
  const plansError = useMenuStore((state) => state.plansError);
  const fetchPlans = useMenuStore((state) => state.fetchPlans);
  const updatePlan = useMenuStore((state) => state.updatePlan);

  const user = useAuthStore((state) => state.user);

  const getDates = () => {
    if (!serverDate) return [];
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(serverDate + "T00:00:00");
      d.setDate(d.getDate() + i);
      arr.push({
        day: d.toLocaleDateString("en-US", {
          weekday: "long",
        }),
        date: d.toLocaleDateString("en-CA"),
        displayDate: d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
      });
    }
    return arr;
  };



  const dates = serverDate ? getDates() : [];

  // 🔥 Load menu from admin
  useEffect(() => {
    const messId = user?.messId?._id || user?.messId;
    if (!serverDate || !messId || !token) return;
    const loadedMessId = useMenuStore.getState().loadedMessId;
    if (loadedMessId === messId) return;
    fetchMenu(messId, token);
  }, [serverDate, user?.messId, token, fetchMenu]);

  // 🔥 Load student selections
  useEffect(() => {
    if (!serverDate || !user?._id || !token) return;

    fetchPlans(user._id, token);
  }, [serverDate, user?._id, token, fetchPlans]);

  // 🔒 lock logic
  const isLocked = (date) => {
    if (!lockDate) return true;

    return date <= lockDate;
  };

  // 🔁 toggle
  const toggleMeal = async (date, meal) => {
    if (isLocked(date)) return;

    const key = `${date}-${meal}`;
    const newStatus = plans[key] === "eat" ? "skip" : "eat";

    await updatePlan({
      userId: user._id,
      date,
      token,
      meal,
      status: newStatus,
    });
  };

  return (
    <StudentLayout>
      <h1 className="text-xl md:text-3xl font-bold mb-6 px-4 md:px-0">
        Weekly Menu
      </h1>
      {menuLoading && (
        <div className="mx-4 md:mx-0 mb-4 text-sm text-gray-500">
          Loading menu...
        </div>
      )}

      {menuError && (
        <div className="mx-4 md:mx-0 mb-4 text-sm text-red-500">
          {menuError}
        </div>
      )}

      {plansLoading && (
        <div className="mx-4 md:mx-0 mb-4 text-sm text-gray-500">
          Loading meal plans...
        </div>
      )}

      {plansError && (
        <div className="mx-4 md:mx-0 mb-4 text-sm text-red-500">
          {plansError}
        </div>
      )}

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow overflow-x-auto mx-4 md:mx-0">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 md:p-3">Day</th>
              <th className="p-2 md:p-3">Breakfast</th>
              <th className="p-2 md:p-3">Lunch</th>
              <th className="p-2 md:p-3">Dinner</th>
            </tr>
          </thead>

          <tbody>
            {dates.map((item) => (
              <tr key={item.date} className="border-t hover:bg-gray-100">
                <td className="p-2 md:p-3 font-medium">
                  <div>{item.day}</div>
                  <div className="text-sm text-gray-500">
                    {item.displayDate}
                  </div>
                </td>

                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <td key={meal} className="p-2 md:p-3">
                    <div
                      className={`flex items-center justify-between ${isLocked(item.date)
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                        }`}
                      onClick={() => toggleMeal(item.date, meal)}
                    >
                      <div>
                        <span className="block break-words whitespace-normal max-w-[140px] md:max-w-[200px] text-sm md:text-base">
                          {menus[item.day]?.[meal] || "Not set"}
                        </span>
                        <div className="text-xs text-gray-400">
                          {item.displayDate}
                        </div>
                      </div>

                      <span className="text-lg">
                        {plans[`${item.date}-${meal}`] === "eat" ? "✅" : "❌"}
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
