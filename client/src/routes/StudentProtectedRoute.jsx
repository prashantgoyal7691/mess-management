import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function StudentProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.studentToken);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}