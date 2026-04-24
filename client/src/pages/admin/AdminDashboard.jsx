import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminDashboard() {
  const [data, setData] = useState({
    today: { breakfast: 0, lunch: 0, dinner: 0 },
    tomorrow: { breakfast: 0, lunch: 0, dinner: 0 },
  });

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const todayDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(todayDate.getDate() + 1);

  useEffect(() => {
    const fetchMealCount = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/meal-count`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        setData(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMealCount();
    const interval = setInterval(fetchMealCount, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Meal consumption overview
          </p>
        </div>

        {/* TABLE STYLE CARD */}
        <div className="bg-white rounded-lg shadow border">
          <div className="border-b px-4 py-3 font-medium">
            Meal Count Comparison
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">Meal</th>
                  <th className="px-4 py-2 text-center">
                    Today <br />
                    <span className="text-xs text-gray-400">
                      {formatDate(todayDate)}
                    </span>
                  </th>
                  <th className="px-4 py-2 text-center">
                    Tomorrow <br />
                    <span className="text-xs text-gray-400">
                      {formatDate(tomorrowDate)}
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3 font-medium">Breakfast</td>
                  <td className="text-center">{data.today.breakfast}</td>
                  <td className="text-center">{data.tomorrow.breakfast}</td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 font-medium">Lunch</td>
                  <td className="text-center">{data.today.lunch}</td>
                  <td className="text-center">{data.tomorrow.lunch}</td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 font-medium">Dinner</td>
                  <td className="text-center">{data.today.dinner}</td>
                  <td className="text-center">{data.tomorrow.dinner}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SMALL SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-3 text-center">
            <p className="text-gray-500 text-sm">Today Total</p>
            <p className="text-lg font-semibold">
              {data.today.breakfast +
                data.today.lunch +
                data.today.dinner}
            </p>
          </div>

          <div className="bg-white border rounded-lg p-3 text-center">
            <p className="text-gray-500 text-sm">Tomorrow Total</p>
            <p className="text-lg font-semibold">
              {data.tomorrow.breakfast +
                data.tomorrow.lunch +
                data.tomorrow.dinner}
            </p>
          </div>

          <div className="bg-white border rounded-lg p-3 text-center">
            <p className="text-gray-500 text-sm">Difference</p>
            <p className="text-lg font-semibold">
              {(data.tomorrow.breakfast +
                data.tomorrow.lunch +
                data.tomorrow.dinner) -
                (data.today.breakfast +
                  data.today.lunch +
                  data.today.dinner)}
            </p>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}