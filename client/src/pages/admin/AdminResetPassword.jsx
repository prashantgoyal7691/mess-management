import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminResetPassword() {
  const location = useLocation();
  const emailFromState = location.state?.email || "";
  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
    if (!email) {
        alert("Session expired. Please try again.");
        navigate("/admin/forgot-password");
        return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, newPassword }),
        },
      );

      const data = await res.json();
      

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Password updated successfully");
      navigate("/admin/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4 text-white">Reset Password</h2>

        <input
          type="email"
          value={email}
          disabled
          className="w-full bg-white/10 border border-white/20 p-2 mb-3 rounded text-gray-400"
        />

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 mb-3 rounded text-white placeholder-gray-400 text-center tracking-widest"
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 mb-3 rounded text-white placeholder-gray-400"
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold p-2 rounded"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
