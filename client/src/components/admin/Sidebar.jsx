import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Students", path: "/admin/students", icon: "👨‍🎓" },
    { name: "Reports", path: "/admin/reports", icon: "📅" },
    { name: "Plan Menu", path: "/admin/meal-plans", icon: "💰" },
    { name: "Feedbacks", path: "/admin/feedbacks", icon: "📢" },
    { name: "Complaints", path: "/admin/complaints", icon: "📢" },
    { name: "Admin Details", path: "/admin/details", icon: "👤" },
    { name: "Set Expense", path: "/admin/set-expense", icon: "💰" },
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
          <h2 className="text-xl font-semibold mb-8 text-white">🍽 Mess Admin</h2>

          <div className="flex flex-col gap-2">
            {menu.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-gray-800 text-white shadow-md"
                    : "hover:bg-gray-800 hover:text-white text-gray-400"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 🔻 BOTTOM SECTION */}
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
