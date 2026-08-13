import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function StudentProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.studentToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}