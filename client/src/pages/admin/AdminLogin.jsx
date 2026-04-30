import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ FIXED HERE
      localStorage.setItem("admin", JSON.stringify(data.admin));
      localStorage.setItem("adminToken", data.token);

      navigate("/admin/dashboard");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">Admin Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
          onChange={handleChange}
        />

        <button
          onClick={handleLogin}
          className="bg-green-400 hover:bg-green-500 text-black font-semibold py-2 rounded-lg w-full"
        >
          Login
        </button>
        <p
          className="text-sm text-blue-400 cursor-pointer mt-2 text-center"
          onClick={() => navigate("/admin/forgot-password")}
        >
          Forgot Password?
        </p>
        <p className="text-sm mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/admin/signup")}
          >
            Signup here
          </span>
        </p>

        <p className="text-sm mt-2 text-gray-400 text-center">
          Are you a student?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Student Login
          </span>
        </p>
      </div>
    </div>
  );
}
