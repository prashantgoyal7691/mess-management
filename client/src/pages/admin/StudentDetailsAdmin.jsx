import AdminLayout from "../../layouts/AdminLayout";
import { useParams } from "react-router-dom";
import { useStudentsStore } from "../../stores/studentsStore";

export default function StudentDetailsAdmin() {
  const { id } = useParams();

  const student = useStudentsStore((state) =>
    state.students.find((student) => student._id === id)
  );

  if (!student) return <div>Student not found</div>;

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">
          Student Profile
        </h1>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div>
            <span className="font-semibold">Name:</span>{" "}
            {student.fullName}
          </div>

          <div>
            <span className="font-semibold">Email:</span>{" "}
            {student.email}
          </div>

          <div>
            <span className="font-semibold">Hostel:</span>{" "}
            {student.hostelName}
          </div>

          <div>
            <span className="font-semibold">Room:</span>{" "}
            {student.roomNumber}
          </div>

          <div>
            <span className="font-semibold">Enrollment:</span>{" "}
            {student.enrolmentNumber}
          </div>

          <div>
            <span className="font-semibold">Phone:</span>{" "}
            {student.phone}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}