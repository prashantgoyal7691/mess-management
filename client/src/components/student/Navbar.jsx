import { useEffect, useState } from "react";

export default function Navbar({ setIsOpen }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <div className="h-16 fixed top-0 left-0 md:left-64 right-0 bg-gray-950 border-b border-gray-800 text-white flex items-center justify-between px-4 md:px-6 z-40">
      <button onClick={() => setIsOpen(true)} className="md:hidden text-xl">☰</button>
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="flex items-center gap-3">
        {user?.photo && (
          <img
            src={user.photo}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
        )}

        <span className="text-gray-200 font-medium text-sm md:text-base truncate max-w-[120px] md:max-w-none">
          {user?.fullName || user?.email || "User"}
        </span>
      </div>
    </div>
  );
}
