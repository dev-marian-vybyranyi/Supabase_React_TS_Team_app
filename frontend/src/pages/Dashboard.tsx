import Header from "@/components/Header";
import TeamInfo from "@/components/TeamInfo";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";

const Dashboard = () => {
  const { teamId } = useAuthStore();
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    if (teamId) {
      fetchProducts(teamId);
    }
  }, [teamId, fetchProducts]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Header />

      <TeamInfo />
    </div>
  );
};

export default Dashboard;
