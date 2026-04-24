import { useLocation } from "react-router-dom";

export default function Navbar({ setIsOpen }) {
  const location = useLocation();
  const admin = JSON.parse(localStorage.getItem("admin"));

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Students", path: "/admin/students" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Complaints", path: "/admin/complaints" },
    { name: "Admin Details", path: "/admin/details" },
  ];

  const currentPage =
    menu.find((m) => m.path === location.pathname)?.name || "Dashboard";

  return (
    <div className="fixed top-0 left-0 md:left-64 right-0 bg-gray-950 border-b border-gray-800 px-4 md:px-6 py-4 flex justify-between items-center z-40">
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden text-white text-xl"
      >
        ☰
      </button>

      <h1 className="text-sm md:text-lg font-semibold text-white truncate max-w-[150px] md:max-w-none">
        {currentPage}
      </h1>

      <div className="text-sm text-gray-400">{admin?.fullName}</div>
    </div>
  );
}
