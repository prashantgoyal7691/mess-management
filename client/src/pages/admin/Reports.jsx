import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useReportStore } from "../../stores/reportStore";

export default function Reports() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const token = useAuthStore((state) => state.adminToken);
  const report = useReportStore((state) => state.report);
  const reportLoading = useReportStore(
    (state) => state.reportLoading
  );
  const reportError = useReportStore(
    (state) => state.reportError
  );
  const fetchReport = useReportStore(
    (state) => state.fetchReport
  );

  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    fetchReport(token);
  }, [token, fetchReport]);

  const filteredReport = report.filter((r) =>
    r.enrolment?.toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentReport = filteredReport.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReport.length / itemsPerPage),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Today's Report</h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden p-4 md:p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Enrollment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />
        </div>
        {reportLoading && (
          <div className="flex justify-center items-center p-8 text-gray-500">
            Loading...
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Name</th>
                <th>Enroll</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {!reportLoading && filteredReport.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
              {!reportLoading &&
                currentReport.map((r, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-purple-50 cursor-pointer"
                    onClick={() => navigate(`/admin/history/${r._id}`)}
                  >
                    <td className="p-4 font-semibold">{r.name}</td>
                    <td className="p-4">{r.enrolment}</td>
                    <td className="text-center p-4">₹{r.breakfast}</td>
                    <td className="text-center p-4">₹{r.lunch}</td>
                    <td className="text-center p-4">₹{r.dinner}</td>
                    <td className="text-center font-bold p-4">₹{r.total}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 p-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
