import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row ">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />


      {/* Main Content */}
      <div className="flex-1 bg-gray-100 min-h-screen pt-16 md:ml-64">
        <Navbar setIsOpen={setIsOpen} />

        <div className="p-4 md:p-6 w-full">{children}</div>
      </div>
    </div>
  );
}