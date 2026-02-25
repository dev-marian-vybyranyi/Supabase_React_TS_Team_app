import type { Session } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

interface DashboardProps {
  session: Session | null;
}

const Dashboard = ({ session }: DashboardProps) => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>My Dashboard</h1>
      <p>You are logged in as: {session?.user?.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Logout</button>
    </div>
  );
};

export default Dashboard;
