import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!otp || !password || !confirmPassword) {
      alert("Fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Password reset successful");

      navigate("/login");

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">

        <h2 className="text-2xl font-bold mb-2 text-white">Reset Password</h2>
        <p className="text-gray-400 mb-4">
          Enter OTP and new password
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-center tracking-widest text-white placeholder-gray-400"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleResetPassword}
          className="bg-green-400 hover:bg-green-500 text-black font-semibold py-2 rounded-lg w-full"
        >
          Reset Password
        </button>

        <p
          className="text-sm text-green-400 mt-4 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>

      </div>
    </div>
  );
}