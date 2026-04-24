import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; // ✅ add this

export default function RoleSelect() {
  const [messes, setMesses] = useState([]);
  const navigate = useNavigate();
  const allMesses = [
    "Jhelum Mess",
    "Jhelum Extension Mess",
    "Indus Mess",
    "Chenab Mess",
    "PG Hostel Mess",
    "Girls Mess",
  ];
  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/messes`);
        const data = await res.json();
        setMesses(data);
      } catch (err) {
        console.log(err);
      }
    };


    fetchMesses();
  }, []);

  const mergedMesses = allMesses.map((name) => {
    const found = messes.find((m) => m.messName === name);

    return {
      messName: name,
      messCode: found?.messCode || null,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* 🔝 Navbar */}
      <div className="sticky top-0 z-50 w-full flex justify-between items-center px-4 md:px-10 py-4 bg-[#0f172a]/80 backdrop-blur-sm border-b border-white/5">
        <h1 className="text-2xl font-bold text-green-400">
          🍽️ NIT Srinagar Mess
        </h1>

        <div className="hidden md:flex gap-6 items-center">
          <button
            onClick={() =>
              document
                .getElementById("messes")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-gray-300 hover:text-white transition"
          >
            View Mess
          </button>

          <button
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-gray-300 hover:text-white transition"
          >
            Features
          </button>

          <button
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-gray-300 hover:text-white transition"
          >
            How It Works
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-gray-300 hover:text-white transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            Sign Up Free
          </button>
        </div>
        <div className="md:hidden flex gap-3">
          <button onClick={() => navigate("/login")} className="text-gray-300">Login</button>
          <button onClick={() => navigate("/signup")} className="bg-green-500 text-white px-3 py-1 rounded">Sign Up</button>
        </div>
      </div>

      {/* 🎯 Hero Section */}
      <div className="mt-16 px-4 md:px-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
            Smart Mess <br />
            <span className="text-green-400">Management System</span>
          </h1>
          <p className="text-green-400 mt-3 font-medium">
            Built for NIT Srinagar Hostel System
          </p>

          <p className="text-gray-300 mt-5 text-lg">
            Digitally manage hostel mess operations with smart attendance,
            billing, and real-time updates — built for NIT Srinagar.
          </p>
          <div className="mt-6 space-y-2 text-gray-300">
            <p>✔ Real-time mess menu updates</p>
            <p>✔ Smart attendance tracking</p>
            <p>✔ Automated monthly billing</p>
            <p>✔ Complaint & feedback system</p>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-400 hover:bg-green-500 text-black px-6 py-3 rounded-xl font-semibold shadow-xl hover:scale-105 transition-all duration-300"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/login")}
              className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Login
            </button>
          </div>
        </div>

        {/* Right side visual */}
        <div className="hidden md:flex justify-center">
          <div className="w-80 h-80 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-3xl blur-2xl"></div>
        </div>
      </div>

      {/* 🏠 Select Your Mess */}
      <div id="messes" className="mt-20 px-4 md:px-10 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Select Your Mess</h2>

        <p className="text-gray-400 mb-10">
          Choose your hostel mess to continue
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mergedMesses.map((mess) => (
            <div
              key={mess.messName}
              onClick={() => {
                if (mess.messCode) {
                  navigate("/signup", {
                    state: {
                      messName: mess.messName,
                      messCode: mess.messCode,
                    },
                  }); // student signup
                } else {
                  navigate("/admin/signup", {
                    state: { messName: mess.messName },
                  }); // admin signup
                }
              }}
              className="group bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-green-400 cursor-pointer transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">
                  {mess.messName}
                </h3>

                {mess.messCode ? (
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                    Active
                  </span>
                ) : (
                  <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                    No Admin
                  </span>
                )}
              </div>

              <p className="text-sm mt-2">
                {mess.messCode ? (
                  <span className="text-gray-300">
                    Code: <span className="font-semibold">{mess.messCode}</span>
                  </span>
                ) : (
                  <span className="text-red-500 text-xs">
                    No admin yet — Register as Admin
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 Features Section */}
      <div className="mt-24 px-4 md:px-10 border-t border-white/10 pt-16"></div>
      <div id="features" className="mt-24 px-4 md:px-10">
        <h2 className="text-3xl font-bold text-center mb-12">
          Features of SmartMess
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <h3 className="font-semibold text-lg mb-2">
              📅 Meal Attendance Tracking
            </h3>
            <p className="text-gray-300">
              Students can mark meals daily and admins can monitor attendance
              easily.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <h3 className="font-semibold text-lg mb-2">
              🍽 Dynamic Menu Management
            </h3>
            <p className="text-gray-300">
              Admin can update weekly menu and students can view it in
              real-time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <h3 className="font-semibold text-lg mb-2">💸 Automated Billing</h3>
            <p className="text-gray-300">
              Bills are generated automatically based on meal consumption.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <h3 className="font-semibold text-lg mb-2">
              🛠 Admin Approval System
            </h3>
            <p className="text-gray-300">
              Students must be approved by admin before accessing the system.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <h3 className="font-semibold text-lg mb-2">
              📊 Reports & Analytics
            </h3>
            <p className="text-gray-300">
              View detailed reports of meals, expenses, and usage.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <h3 className="font-semibold text-lg mb-2">
              📢 Feedback & Complaints
            </h3>
            <p className="text-gray-300">
              Students can raise complaints and give feedback to improve mess
              quality.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-28 px-4 md:px-10 text-center border-t border-white/10 pt-16"></div>

      {/* 🔄 How It Works */}
      <div id="how-it-works" className="mt-28 px-4 md:px-10 text-center">
        <p className="text-green-300 bg-green-500/10 inline-block px-4 py-1 rounded-full text-sm mb-4">
          Simple Process
        </p>

        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-400 mb-12">Get started in under a minute</p>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-green-200 text-5xl font-bold mb-4">01</div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 text-black p-4 rounded-2xl mb-4 text-2xl">
              👤
            </div>
            <h3 className="font-semibold">Create Account</h3>
            <p className="text-gray-400 text-sm mt-2">
              Sign up using your college email and basic details.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-green-200 text-5xl font-bold mb-4">02</div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 text-black p-4 rounded-2xl mb-4 text-2xl">
              🛡
            </div>
            <h3 className="font-semibold">Admin Approval</h3>
            <p className="text-gray-400 text-sm mt-2">
              Wait for admin verification before accessing the system.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-green-200 text-5xl font-bold mb-4">03</div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 text-black p-4 rounded-2xl mb-4 text-2xl">
              📅
            </div>
            <h3 className="font-semibold">Access Dashboard</h3>
            <p className="text-gray-400 text-sm mt-2">
              View menu, mark attendance, and manage your meals.
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-green-500 text-5xl font-bold mb-4">04</div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 text-black p-4 rounded-2xl mb-4 text-2xl">
              ⭐
            </div>
            <h3 className="font-semibold">Give Feedback</h3>
            <p className="text-gray-400 text-sm mt-2">
              Rate meals and submit complaints to improve quality.
            </p>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-green-500 text-5xl font-bold mb-4">05</div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 text-black p-4 rounded-2xl mb-4 text-2xl">
              📈
            </div>
            <h3 className="font-semibold">Track History</h3>
            <p className="text-gray-400 text-sm mt-2">
              View attendance, billing, and meal history anytime.
            </p>
          </div>
        </div>
      </div>

      {/* 🔻 Footer */}
      <div className="mt-24 px-4 md:px-10 border-t border-white/10 pt-10 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 text-gray-400">
          {/* Left */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-green-400">🍽️ SmartMess</h2>
            <p className="text-sm mt-2 text-gray-400 max-w-xs">
              A centralized platform for managing hostel mess operations at NIT
              Srinagar — built for students and admins.
            </p>
          </div>

          {/* Middle Links */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
            <button
              onClick={() =>
                document
                  .getElementById("messes")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-white"
            >
              View Mess
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-white"
            >
              Features
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-white"
            >
              How It Works
            </button>

            <button
              onClick={() => navigate("/login")}
              className="hover:text-white"
            >
              Login
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center text-gray-500 mt-6 text-sm">
          © {new Date().getFullYear()} SmartMess — NIT Srinagar. All rights reserved.
        </div>
      </div>
    </div>
  );
}
