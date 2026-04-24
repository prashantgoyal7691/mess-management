import { useNavigate } from "react-router-dom";

export default function StudentAuth() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">Student Access</h2>
        <p className="text-gray-400 mb-6">
          Login or create a new account
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="bg-green-400 hover:bg-green-500 transition text-black font-semibold px-6 py-2 rounded-lg mb-3 w-full"
        >
          Signup
        </button>

        <button
          onClick={() => navigate("/login")}
          className="bg-white/10 hover:bg-white/20 transition text-white border border-white/20 px-6 py-2 rounded-lg w-full"
        >
          Signin
        </button>
      </div>
    </div>
  );
}