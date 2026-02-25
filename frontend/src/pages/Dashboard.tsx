import type { Session } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

interface DashboardProps {
  session: Session | null;
  teamId: string;
}

const Dashboard = ({ session, teamId }: DashboardProps) => {
  return (
    <div className="p-4">
      <h1>My Dashboard</h1>
      <p>You are logged in as: {session?.user?.email}</p>

      <div className="bg-gray-100 p-4 rounded-lg my-4">
        <p>
          <strong>Your Team ID:</strong> {teamId}
        </p>
      </div>

      <button onClick={() => supabase.auth.signOut()}>Logout</button>
    </div>
  );
};

export default Dashboard;
