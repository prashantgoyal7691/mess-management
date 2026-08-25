import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { useAuthStore } from "../../stores/authStore";
import { useReportStore } from "../../stores/reportStore";


export default function StudentHistory() {
  const { id } = useParams();
  const [month, setMonth] = useState("");

  const token = useAuthStore((state) => state.adminToken);

  const meals = useReportStore((state) => state.history);
  const student = useReportStore(
    (state) => state.historyStudent
  );

  const historyLoading = useReportStore(
    (state) => state.historyLoading
  );

  const historyError = useReportStore(
    (state) => state.historyError
  );

  const reportServerDate = useReportStore(
    (state) => state.reportServerDate
  );

  const fetchReportServerDate = useReportStore(
    (state) => state.fetchReportServerDate
  );



  const fetchHistory = useReportStore(
    (state) => state.fetchHistory
  );

  const downloadHistoryPDF = useReportStore(
    (state) => state.downloadHistoryPDF
  );

  useEffect(() => {
    if (!reportServerDate || month) return;

    setMonth(reportServerDate.slice(0, 7));
  }, [reportServerDate, month]);

  useEffect(() => {
    fetchReportServerDate();
  }, [fetchReportServerDate]);

  useEffect(() => {
    if (!month) return;

    fetchHistory(token, id, month);
  }, [token, id, month, fetchHistory]);

  const totalMonthBill = meals.reduce((sum, m) => sum + m.total, 0);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">
          Student Meal History
        </h1>

        {student && (
          <div className="bg-white p-4 md:p-5 rounded-xl shadow mb-4">
            <h2 className="text-xl font-bold">{student.name}</h2>
            <p className="text-gray-600">{student.enrolment}</p>
          </div>
        )}
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded mb-4 w-full md:w-auto"
        />
        {historyLoading && (
          <div className="flex justify-center items-center p-8 text-gray-500">
            Loading...
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border min-w-[600px]">
            <thead className="bg-gray-100">
              <tr>
                <th>Date</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
                <th>Total ₹</th>
              </tr>
            </thead>

            <tbody>
              {meals.map((m, i) => (
                <tr key={i} className="border-t text-center">
                  <td>{m.date}</td>

                  <td className="text-center">₹{m.breakfast}</td>

                  <td className="text-center">₹{m.lunch}</td>

                  <td className="text-center">₹{m.dinner}</td>

                  <td className="font-bold">₹{m.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-left md:text-right text-lg md:text-xl font-bold">
          Total Monthly Bill: ₹{totalMonthBill}
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded w-full md:w-auto mt-2"
          onClick={() => downloadHistoryPDF(token, id, month)}
        >
          📄 Download PDF
        </button>
      </div>
    </AdminLayout>
  );
}
