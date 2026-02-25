import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  session: any;
  children: React.ReactNode;
}

const ProtectedRoute = ({ session, children }: ProtectedRouteProps) => {
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
