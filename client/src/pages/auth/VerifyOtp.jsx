import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function VerifyOtp() {
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem("otpEmail");

  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      alert(data.message || "OTP verified successfully");
      localStorage.setItem("studentToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/student/dashboard";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl p-8 rounded-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">Verify OTP</h2>
        <p className="text-gray-400 mb-4">
          Enter the code sent to your email
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 mb-3 rounded text-center text-lg tracking-widest text-white placeholder-gray-400"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="w-full bg-green-400 hover:bg-green-500 transition text-black font-semibold py-2 rounded-lg"
        >
          Verify
        </button>
      </div>
    </div>
  );
}