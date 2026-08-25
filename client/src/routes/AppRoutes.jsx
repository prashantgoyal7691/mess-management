import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";

import Login from "../pages/student/auth/Login";
import Signup from "../pages/student/auth/Signup";
import VerifyOtp from "../pages/student/auth/VerifyOtp";
import ForgotPassword from "../pages/student/auth/ForgotPassword";
import ResetPassword from "../pages/student/auth/ResetPassword";

import StudentProtectedRoute from "./StudentProtectedRoute";

import StudentDashboard from "../pages/student/StudentDashboard";
import Menu from "../pages/student/Menu";
import Feedback from "../pages/student/Feedback";
import Complaints from "../pages/student/Complaints";
import Attendance from "../pages/student/Attendance";
import MyFeedbacks from "../pages/student/MyFeedbacks";
import MyComplaints from "../pages/student/MyComplaints";
import StudentDetails from "../pages/student/StudentDetails";

import AdminLogin from "../pages/admin/auth/AdminLogin";
import AdminSignup from "../pages/admin/auth/AdminSignup";
import AdminForgotPassword from "../pages/admin/auth/AdminForgotPassword";
import AdminResetPassword from "../pages/admin/auth/AdminResetPassword";

import AdminProtectedRoute from "./AdminProtectedRoute";

import SetExpense from "../pages/admin/SetExpense";
import ExpenseHistory from "../pages/admin/ExpenseHistory";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminDetails from "../pages/admin/AdminDetails";
import Students from "../pages/admin/Students";
import MealPlans from "../pages/admin/MealPlans";
import Reports from "../pages/admin/Reports";
import ComplaintsAdmin from "../pages/admin/ComplaintsAdmin";
import FeedbacksAdmin from "../pages/admin/feedbacksAdmin";
import StudentHistory from "../pages/admin/StudentHistory";
import StudentDetailsAdmin from "../pages/admin/StudentDetailsAdmin";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        <Route
          path="/student/dashboard"
          element={
            <StudentProtectedRoute>
              <StudentDashboard />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student/details"
          element={
            <StudentProtectedRoute>
              <StudentDetails />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student/my-feedbacks"
          element={
            <StudentProtectedRoute>
              <MyFeedbacks />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student/my-complaints"
          element={
            <StudentProtectedRoute>
              <MyComplaints />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student/menu"
          element={
            <StudentProtectedRoute>
              <Menu />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student/feedback"
          element={
            <StudentProtectedRoute>
              <Feedback />
            </StudentProtectedRoute>
          }   
        />

        <Route
          path="/student/complaints"
          element={
            <StudentProtectedRoute>
              <Complaints />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/student/attendance"
          element={
            <StudentProtectedRoute>
              <Attendance />
            </StudentProtectedRoute>
          }
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
