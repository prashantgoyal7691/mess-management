import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useStudentsStore } from "../../stores/studentsStore";

export default function Students() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 8;
  const navigate = useNavigate();

  const token = useAuthStore((state) => state.adminToken);

  const students = useStudentsStore((state) => state.students);
  const studentsLoading = useStudentsStore(
    (state) => state.studentsLoading
  );

  const mutationLoading = useStudentsStore(
    (state) => state.mutationLoading
  );
  const error = useStudentsStore((state) => state.error);

  const fetchStudents = useStudentsStore(
    (state) => state.fetchStudents,
  );

  const approveStudent = useStudentsStore(
    (state) => state.approveStudent,
  );

  const rejectStudent = useStudentsStore(
    (state) => state.rejectStudent,
  );

  const deleteStudent = useStudentsStore(
    (state) => state.deleteStudent,
  );



  const handleApprove = async (studentId) => {
    if (mutationLoading) return;

    if (!window.confirm("Are you sure you want to approve this student?")) {
      return;
    }

    try {
      await approveStudent(token, studentId);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (studentId) => {
    if (mutationLoading) return;

    if (!window.confirm("Are you sure you want to reject this student?")) {
      return;
    }

    try {
      await rejectStudent(token, studentId);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (studentId) => {
    if (mutationLoading) return;

    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await deleteStudent(token, studentId);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudents(token);
  }, [token, fetchStudents]);

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.enrolmentNumber
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "approved" && s.isApproved) ||
      (filter === "pending" && !s.isApproved);

    return matchesSearch && matchesFilter;
  });

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;

  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / studentsPerPage),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Students</h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {studentsLoading && <p className="text-center p-4 text-gray-500">Loading...</p>}

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by Enrollment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Hostel</th>
                <th className="text-left">Room</th>
                <th className="text-left">Enrollment</th>
                <th className="text-left">Phone</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!studentsLoading && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
              {currentStudents.map((s) => (
                <tr
                  key={s._id}
                  className={`border-t hover:bg-purple-50 cursor-pointer ${!s.isApproved ? "bg-yellow-50" : ""
                    }`}
                  onClick={() => navigate(`/admin/student/${s._id}`)}
                >
                  <td className="p-4 font-semibold">{s.fullName}</td>
                  <td className="p-4">{s.email}</td>
                  <td className="p-4">{s.hostelName}</td>
                  <td className="p-4">{s.roomNumber}</td>
                  <td className="p-4">{s.enrolmentNumber}</td>
                  <td className="p-4">{s.phone}</td>
                  <td className="p-4">
                    {s.isApproved ? (
                      <div className="flex gap-2">
                        <span className="text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">
                          Approved
                        </span>

                        <button
                          disabled={mutationLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(s._id);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs">
                          Pending
                        </span>
                        <button
                          disabled={mutationLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(s._id);
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Approve
                        </button>

                        <button
                          disabled={mutationLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(s._id);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
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
