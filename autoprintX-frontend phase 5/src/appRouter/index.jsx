import { Route, Routes } from "react-router-dom";
import App from "../App";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import Cart from "@/components/Cart";
import SuccessPage from "@/components/SuccessPage";
import PrivateRoute from "@/components/PrivateRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<App />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/success" element={<SuccessPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
