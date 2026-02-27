import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import OnboardingPage from "./pages/OnboardingPage";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const { hasTeam, loading, initialize, isRecovery } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  if (loading) return <Loader fullScreen size="lg" text="Loading..." />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/"
          element={
            isRecovery ? (
              <Navigate to="/auth" replace />
            ) : (
              <ProtectedRoute>
                {hasTeam === null ? (
                  <Loader fullScreen text="Checking team data..." />
                ) : hasTeam === false ? (
                  <OnboardingPage />
                ) : (
                  <Dashboard />
                )}
              </ProtectedRoute>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
