import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminDetails() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
  const fetchAdmin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      const data = await res.json();
      setAdmin(data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchAdmin();
}, []);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 flex justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Admin Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="text-base md:text-lg font-semibold">
                {admin?.fullName || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-base md:text-lg font-semibold">
                {admin?.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Mess Name</p>
              <p className="text-base md:text-lg font-semibold">
                {admin?.messName || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Mess Code</p>
              <p className="text-base md:text-lg font-semibold text-purple-600">
                {admin?.messCode || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="text-base md:text-lg font-semibold">
                {admin?.phoneNumber || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Mess Address</p>
              <p className="text-base md:text-lg font-semibold">
                {admin?.messAddress || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Admin ID</p>
              <p className="text-base md:text-lg font-semibold">
                {admin?._id || "-"}
              </p>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}