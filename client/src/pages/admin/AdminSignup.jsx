import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSignup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    messName: "",
    phoneNumber: "",
    messAddress: "",
    otp: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        messName: form.messName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("OTP sent");
    setStep(2);
  };

  const verifyOtp = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Signup successful");
    localStorage.setItem("admin", JSON.stringify(data.admin));
    localStorage.setItem("adminToken", data.token);
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">👨‍💼 Admin Signup</h2>

        {step === 1 && (
          <>
            <input
              name="fullName"
              placeholder="Full Name"
              className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
              onChange={handleChange}
            />

            <select
              name="messName"
              value={form.messName}
              onChange={handleChange}
              className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
            >
              <option value="">Select Mess</option>
              <option value="Jhelum Mess">Jhelum Mess</option>
              <option value="Jhelum Extension Mess">
                Jhelum Extension Mess
              </option>
              <option value="Indus Mess">Indus Mess</option>
              <option value="Chenab Mess">Chenab Mess</option>
              <option value="PG Hostel Mess">PG Hostel Mess</option>
              <option value="Girls Mess">Girls Mess</option>
            </select>

            <input
              name="phoneNumber"
              placeholder="Phone Number"
              className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
              onChange={handleChange}
            />

            <input
              name="messAddress"
              placeholder="Mess Address"
              className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email"
              className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
              onChange={handleChange}
            />

            <button
              onClick={sendOtp}
              className="bg-green-400 hover:bg-green-500 text-black font-semibold py-2 rounded-lg w-full"
            >
              Send OTP
            </button>

            <p className="text-sm mt-4 text-gray-400">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/admin/login")}
                className="text-green-400 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>

            <p className="text-sm mt-2 text-gray-400">
              Are you a student?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-green-400 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <input
              name="otp"
              placeholder="Enter OTP"
              className="bg-white/10 border border-white/20 focus:ring-2 focus:ring-green-400 outline-none p-2 w-full mb-3 rounded text-white placeholder-gray-400"
              onChange={handleChange}
            />

            <button
              onClick={verifyOtp}
              className="bg-green-400 hover:bg-green-500 text-black font-semibold py-2 rounded-lg w-full"
            >
              Verify & Signup
            </button>

            <p className="text-sm mt-4 text-gray-400">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/admin/login")}
                className="text-green-400 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>

            <p className="text-sm mt-2 text-gray-400">
              Are you a student?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-green-400 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
