import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import OnboardingPage from "./pages/OnboardingPage";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const { session, hasTeam, loading, initialize, checkUserTeam } =
    useAuthStore();

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
            <ProtectedRoute>
              {hasTeam === null ? (
                <Loader fullScreen text="Checking team data..." />
              ) : hasTeam === false ? (
                <OnboardingPage
                  onComplete={() => checkUserTeam(session!.user.id)}
                />
              ) : (
                <Dashboard />
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
