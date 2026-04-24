import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("OTP sent to your email");

      navigate("/reset-password", { state: { email } });

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">

        <h2 className="text-2xl font-bold mb-2 text-white">Forgot Password</h2>
        <p className="text-gray-400 mb-4">
          Enter your email to receive OTP
        </p>

        <input
          type="email"
          placeholder="Enter Email"
          className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-4 rounded text-white placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSendOtp}
          className="bg-green-400 hover:bg-green-500 text-black font-semibold py-2 rounded-lg w-full"
        >
          Send OTP
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