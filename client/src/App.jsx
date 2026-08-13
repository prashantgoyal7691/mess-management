import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useSystemStore } from "./stores/systemStore";

function App() {
  const fetchSystemDate = useSystemStore(
    (state) => state.fetchSystemDate
  );

  useEffect(() => {
    fetchSystemDate();
  }, [fetchSystemDate]);

  return <AppRoutes />;
}

export default App;