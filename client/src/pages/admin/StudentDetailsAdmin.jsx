import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";

export default function StudentDetailsAdmin() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/students`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      const data = await res.json();
      setStudent(data.find((s) => s._id === id));
    };

    fetchStudent();
  }, [id]);

  if (!student) return <div>Loading...</div>;

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">👤 Student Profile</h1>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="flex flex-col text-sm md:text-base"><span className="font-semibold">Name:</span> {student.fullName}</div>
          <div className="flex flex-col text-sm md:text-base"><span className="font-semibold">Email:</span> {student.email}</div>
          <div className="flex flex-col text-sm md:text-base"><span className="font-semibold">Hostel:</span> {student.hostelName}</div>
          <div className="flex flex-col text-sm md:text-base"><span className="font-semibold">Room:</span> {student.roomNumber}</div>
          <div className="flex flex-col text-sm md:text-base"><span className="font-semibold">Enrollment:</span> {student.enrolmentNumber}</div>
          <div className="flex flex-col text-sm md:text-base"><span className="font-semibold">Phone:</span> {student.phone}</div>
        </div>
      </div>
    </AdminLayout>
  );
}