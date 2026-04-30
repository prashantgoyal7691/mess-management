import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        setLoading(false);
        return;
      }

      navigate("/admin/reset-password", { state: { email } });

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4 text-white">Admin Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 mb-4 rounded text-white placeholder-gray-400"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSendOtp}
          disabled={loading}
          className={`w-full bg-green-400 text-black font-semibold p-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-500"}`}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
}