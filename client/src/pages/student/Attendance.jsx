import StudentLayout from "../../layouts/StudentLayout";
import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useSystemStore } from "../../stores/systemStore";
import { useAttendanceStore } from "../../stores/attendanceStore";
import { downloadInvoice } from "../../services/billingService";

export default function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.studentToken);
  const serverDate = useSystemStore((state) => state.today);
  const serverToday = useMemo(() => {
    return serverDate
      ? new Date(serverDate + "T00:00:00")
      : null;
  }, [serverDate]);

  useEffect(() => {
    if (!serverToday) return;

    setSelectedMonth(serverToday.getMonth());
    setSelectedYear(serverToday.getFullYear());
  }, [serverToday]);

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
  const attendance = useAttendanceStore(
    (state) => state.attendance,
  );

  const bill = useAttendanceStore(
    (state) => state.bill,
  );

  const attendanceLoading = useAttendanceStore(
    (state) => state.attendanceLoading,
  );

  const billingLoading = useAttendanceStore(
    (state) => state.billingLoading,
  );

  const attendanceError = useAttendanceStore(
    (state) => state.attendanceError,
  );

  const billingError = useAttendanceStore(
    (state) => state.billingError,
  );

  const fetchMonth = useAttendanceStore(
    (state) => state.fetchMonth,
  );

  useEffect(() => {
    if (
      !user?._id ||
      !token ||
      !serverToday ||
      selectedMonth === null ||
      selectedYear === null
    ) {
      return;
    }

    const monthString = `${selectedYear}-${String(
      selectedMonth + 1,
    ).padStart(2, "0")}`;

    fetchMonth({
      userId: user._id,
      token,
      month: monthString,
      selectedYear,
      selectedMonth,
      serverToday,
    });
  }, [
    selectedMonth,
    selectedYear,
    serverToday,
    user?._id,
    token,
    fetchMonth,
  ]);

  const handleDownloadInvoice = async () => {
    try {
      if (!token) {
        alert("Please login again.");
        return;
      }

      const monthKey = `${selectedYear}-${String(
        selectedMonth + 1,
      ).padStart(2, "0")}`;

      const blob = await downloadInvoice({
        month: monthKey,
        token,
      });

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = `Invoice-${monthKey}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      alert("Failed to download invoice.");
    }
  };

  return (
    <StudentLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 px-4 md:px-0">
        <h1 className="text-xl md:text-3xl font-bold">
          {selectedMonth !== null && selectedYear !== null
            ? `Monthly Attendance (${months[selectedMonth]} ${selectedYear})`
            : "Monthly Attendance"}
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={selectedMonth ?? ""}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border p-2 rounded w-full"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={selectedYear ?? ""}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border p-2 rounded w-full sm:w-24"
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
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow overflow-x-auto mx-4 md:mx-0">
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
                className={`mt-2 text-sm ${item.isFuture ? "text-gray-300" : ""
                  }`}
              >
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 md:p-5 rounded-xl shadow mb-6 mx-4 md:mx-0">
        <h2 className="text-xl font-semibold mb-3">Monthly Bill</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="col-span-2 font-bold text-lg mt-2">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Food Bill</span>

                <span>₹{bill.foodBill}</span>
              </div>

              <div className="flex justify-between">
                <span>Management Fee</span>

                <span>₹{bill.managementFee}</span>
              </div>

              <hr />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>

                <span>₹{bill.totalBill}</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="font-semibold">Status :</span>{" "}
                  <span
                    className={`font-semibold ${bill.status === "Paid"
                      ? "text-green-600"
                      : bill.status === "Pending"
                        ? "text-orange-500"
                        : "text-blue-600"
                      }`}
                  >
                    {bill.status}
                  </span>
                </div>

                {bill.status !== "In Progress" && (
                  <button
                    onClick={handleDownloadInvoice}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Download Invoice
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
