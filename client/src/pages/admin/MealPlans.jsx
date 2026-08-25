import { useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAuthStore } from "../../stores/authStore";
import { useMenuStore } from "../../stores/menuStore";


export default function MealPlans() {
  const token = useAuthStore((state) => state.adminToken);

  const menu = useMenuStore((state) => state.adminMenu);
  const serverDate = useMenuStore((state) => state.serverDate);
  const lockDate = useMenuStore((state) => state.lockDate);
  const loading = useMenuStore((state) => state.adminMenuLoading);
  const saving = useMenuStore((state) => state.adminMenuSaving);
  const error = useMenuStore((state) => state.adminMenuError);

  const fetchAdminMenu = useMenuStore(
    (state) => state.fetchAdminMenu
  );

  const updateAdminMenu = useMenuStore(
    (state) => state.updateAdminMenu
  );

  const saveAdminMenu = useMenuStore(
    (state) => state.saveAdminMenu
  );

  useEffect(() => {
    fetchAdminMenu(token);
  }, [token, fetchAdminMenu]);

  // 🔥 Generate next 7 days (dynamic UI)
  const getDates = () => {
    const arr = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(serverDate + "T00:00:00");
      d.setDate(d.getDate() + i);

      arr.push({
        date: d.toLocaleDateString("en-CA"),
        day: d.toLocaleDateString("en-US", { weekday: "long" }),
        display: d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
      });
    }

    return arr;
  };

  const dates = serverDate ? getDates() : [];


  const isEditable = (date) => {
    if (!lockDate) return false;

    return date > lockDate;
  };

  // 🔁 Handle change (date-based state)
  const handleChange = (day, meal, value) => {
    updateAdminMenu(day, meal, value);
  };

  // 💾 Save menu (convert date → day)
  const handleSubmit = async () => {
  try {
    await saveAdminMenu(token, dates);
    alert("Weekly menu saved successfully!");
  } catch (err) {
    console.log(err);
    alert(err.message || "Error saving menu");
  }
};

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">
          Weekly Menu Planner
        </h1>

        <div className="bg-white shadow rounded-lg p-4 md:p-6">
          <div className="overflow-x-auto">
            <table className="w-full border min-w-[600px]">
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
                      <div className="text-sm text-gray-500">
                        {item.display}
                      </div>
                    </td>

                    {["breakfast", "lunch", "dinner"].map((meal) => (
                      <td key={meal} className="border p-3">
                        <textarea
                          value={menu[item.day]?.[meal] || ""}
                          onChange={(e) =>
                            handleChange(item.day, meal, e.target.value)
                          }
                          disabled={!isEditable(item.date)}
                          rows={2}
                          className={`border p-2 w-full text-sm md:text-base resize-none break-words whitespace-normal ${!isEditable(item.date)
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
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded w-full md:w-auto"
          >
            Save Weekly Menu
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
