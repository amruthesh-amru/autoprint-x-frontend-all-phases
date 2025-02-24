import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const customer = useSelector((state) => state.user.customer); // Get user from Redux

  return customer ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
