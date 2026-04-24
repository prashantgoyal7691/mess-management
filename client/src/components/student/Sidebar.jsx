import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaStar,
  FaExclamationCircle,
  FaUser,
} from "react-icons/fa";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/student/dashboard", icon: <FaHome /> },
    { name: "Menu", path: "/student/menu", icon: <FaUtensils /> },
    { name: "Feedback", path: "/student/feedback", icon: <FaStar /> },
    {
      name: "Complaints",
      path: "/student/complaints",
      icon: <FaExclamationCircle />,
    },
    { name: "Student Details", path: "/student/details", icon: <FaUser /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <div
        className={`
        fixed top-0 left-0 h-screen w-64 bg-gray-950 border-r border-gray-800 p-5 flex flex-col justify-between overflow-y-auto text-gray-200 z-50
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <div>
          <h2 className="text-2xl font-bold mb-8">SmartMess</h2>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-800 text-gray-400"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto text-red-400 hover:text-red-300 text-sm border-t border-gray-700 pt-4"
        >
          Logout
        </button>
      </div>
    </>
  );
}
