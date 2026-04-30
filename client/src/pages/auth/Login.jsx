import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("studentToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/student/dashboard";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">Login</h2>
        <p className="text-gray-400 mb-4">Welcome back</p>

        <input
          type="email"
          placeholder="Enter Email"
          className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleEmailLogin}
          className="bg-green-400 hover:bg-green-500 text-black font-semibold transition px-6 py-2 rounded-lg w-full mb-3"
        >
          Login
        </button>
        <p
          className="text-sm text-blue-600 cursor-pointer mt-2"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>

        <p className="text-sm mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </span>
        </p>
        <p className="text-sm mt-3 text-center text-gray-400">
          Are you an admin?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/admin/login")}
          >
            Admin Login
          </span>
        </p>
      </div>
    </div>
  );
}
