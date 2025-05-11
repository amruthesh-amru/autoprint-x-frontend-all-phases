import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  // Replace 'authToken' with your actual cookie name
  const token = Cookies.get("token");
  console.log(token);

  // Optionally, you could also check for user info stored in your Redux state
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
