import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import ProductDialog from "./products/ProductDialog";
import { Button } from "./ui/button";

const Header = () => {
  const { session, signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    toast.success("You have been logged out successfully!");
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground">{session?.user?.email}</p>
      </div>
      <div className="flex gap-3">
        <ProductDialog mode="create" />
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Header;
