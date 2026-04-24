import StudentLayout from "../../layouts/StudentLayout";
import { useEffect, useState } from "react";

export default function StudentDetails() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
          },
        });

        const data = await res.json();
        setUser(data); // 🔥 THIS WAS MISSING
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);
  
  if (!user) {
    return (
      <StudentLayout>
        <div className="p-6 text-center">Loading...</div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-4 md:p-6 flex justify-center">
        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg w-full max-w-2xl">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
            👤 Student Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="text-base md:text-lg font-semibold">{user?.fullName || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-base md:text-lg font-semibold">{user?.email || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Hostel</p>
              <p className="text-base md:text-lg font-semibold">{user?.hostelName || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Room Number</p>
              <p className="text-base md:text-lg font-semibold">{user?.roomNumber || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Enrollment Number</p>
              <p className="text-base md:text-lg font-semibold">
                {user?.enrolmentNumber || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="text-base md:text-lg font-semibold">{user?.phone || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">messId</p>
              <p className="text-base md:text-lg font-semibold">{user?._id || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">messCode</p>
              <p className="text-base md:text-lg font-semibold">{user?.messId?.messCode || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
