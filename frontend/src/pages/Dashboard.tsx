import Header from "@/components/Header";
import ProductsList from "@/components/products/ProductsList";
import TeamInfo from "@/components/TeamInfo";

const Dashboard = () => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <Header />
      <TeamInfo />
      <ProductsList />
    </div>
  );
};

export default Dashboard;
