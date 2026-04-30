import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import StudentDashboard from "../pages/student/StudentDashboard";
import Menu from "../pages/student/Menu";
import Feedback from "../pages/student/Feedback";
import Complaints from "../pages/student/Complaints";
import Attendance from "../pages/student/Attendance";
import MyFeedbacks from "../pages/student/MyFeedbacks";
import MyComplaints from "../pages/student/MyComplaints";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import VerifyOtp from "../pages/auth/VerifyOtp";
import RoleSelect from "../pages/auth/RoleSelect";
import StudentAuth from "../pages/auth/StudentAuth";
import StudentDetails from "../pages/student/StudentDetails";

import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import AdminProtectedRoute from "../utils/AdminProtectedRoute";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminSignup from "../pages/admin/AdminSignup";
import AdminDetails from "../pages/admin/AdminDetails";
import AdminForgotPassword from "../pages/admin/AdminForgotPassword";
import AdminResetPassword from "../pages/admin/AdminResetPassword";
import SetExpense from "../pages/admin/SetExpense";
import ExpenseHistory from "../pages/admin/ExpenseHistory";


import Students from "../pages/admin/Students";
import MealPlans from "../pages/admin/MealPlans";
import Reports from "../pages/admin/Reports";
import ComplaintsAdmin from "../pages/admin/ComplaintsAdmin";
import FeedbacksAdmin from "../pages/admin/feedbacksAdmin";
import StudentHistory from "../pages/admin/StudentHistory";
import StudentDetailsAdmin from "../pages/admin/StudentDetailsAdmin";

export default function AppRoutes() {
  const token = localStorage.getItem("studentToken");
  const isAuthenticated = !!token;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelect />} />

        <Route path="/student-auth" element={<StudentAuth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/student/dashboard"
          element={isAuthenticated ? <StudentDashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/student/details"
          element={isAuthenticated ? <StudentDetails /> : <Navigate to="/" />}
        />

        <Route
          path="/student/my-feedbacks"
          element={isAuthenticated ? <MyFeedbacks /> : <Navigate to="/" />}
        />

        <Route
          path="/student/my-complaints"
          element={isAuthenticated ? <MyComplaints /> : <Navigate to="/" />}
        />

        <Route
          path="/student/menu"
          element={isAuthenticated ? <Menu /> : <Navigate to="/" />}
        />

        <Route
          path="/student/feedback"
          element={isAuthenticated ? <Feedback /> : <Navigate to="/" />}
        />

        <Route
          path="/student/complaints"
          element={isAuthenticated ? <Complaints /> : <Navigate to="/" />}
        />

        <Route
          path="/student/attendance"
          element={isAuthenticated ? <Attendance /> : <Navigate to="/" />}
        />

        {/* ✅ ADMIN ROUTES */}

        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/set-expense"
          element={
            <AdminProtectedRoute>
              <SetExpense />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/expense-history"
          element={
            <AdminProtectedRoute>
              <ExpenseHistory />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/meal-plans"
          element={
            <AdminProtectedRoute>
              <MealPlans />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <AdminProtectedRoute>
              <Reports />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <AdminProtectedRoute>
              <ComplaintsAdmin />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/feedbacks"
          element={
            <AdminProtectedRoute>
              <FeedbacksAdmin />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <AdminProtectedRoute>
              <Students />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/details"
          element={
            <AdminProtectedRoute>
              <AdminDetails />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/history/:id"
          element={
            <AdminProtectedRoute>
              <StudentHistory />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/student/:id"
          element={
            <AdminProtectedRoute>
              <StudentDetailsAdmin />
            </AdminProtectedRoute>
          }
        />

        {/* ✅ ALWAYS LAST */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
