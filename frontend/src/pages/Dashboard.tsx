import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const Dashboard = () => {
  const { session, teamId, signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    toast.success("You have been logged out successfully!");
  };

  return (
    <div className="p-4">
      <h1>My Dashboard</h1>
      <p>You are logged in as: {session?.user?.email}</p>

      <div className="bg-gray-100 p-4 rounded-lg my-4">
        <p>
          <strong>Your Team ID:</strong> {teamId}
        </p>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
