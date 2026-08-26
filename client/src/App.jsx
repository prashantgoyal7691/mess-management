import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useSystemStore } from "./stores/systemStore";
import { useAuthStore } from "./stores/authStore";

function App() {
  const fetchSystemDate = useSystemStore(
    (state) => state.fetchSystemDate
  );

  const refreshStudentProfile = useAuthStore(
    (state) => state.refreshStudentProfile
  );

  useEffect(() => {
    fetchSystemDate();
    refreshStudentProfile();
  }, [fetchSystemDate, refreshStudentProfile]);

  return <AppRoutes />;
}

export default App;