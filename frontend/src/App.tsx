import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import OnboardingPage from "./pages/OnboardingPage";
import { supabase } from "./supabaseClient";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [hasTeam, setHasTeam] = useState<boolean | null>(null);
  const [teamId, setTeamId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const checkUserTeam = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("team_id")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error checking user team:", error);
      }

      if (data && data.team_id) {
        setTeamId(data.team_id);
        setHasTeam(true);
      } else {
        setHasTeam(false);
      }
    } catch (err) {
      console.error(err);
      setHasTeam(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkUserTeam(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setSession(session);
        if (session) {
          checkUserTeam(session.user.id);
        } else {
          setHasTeam(null);
          setLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage session={session} />} />

        <Route
          path="/"
          element={
            <ProtectedRoute session={session}>
              {hasTeam === null ? (
                <div>Checking team data...</div>
              ) : hasTeam === false ? (
                <OnboardingPage
                  onComplete={() => checkUserTeam(session!.user.id)}
                />
              ) : (
                <Dashboard session={session} teamId={teamId} />
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
