import { Route, Routes } from "react-router-dom";
import App from "../App";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import Cart from "@/components/Cart";
import SuccessPage from "@/components/SuccessPage";
const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </>
  );
};

export default AppRouter;
