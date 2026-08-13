import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function AdminProtectedRoute({ children }) {
  const admin = useAuthStore((state) => state.admin);
  const token = useAuthStore((state) => state.adminToken);

  if (!admin || !token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}