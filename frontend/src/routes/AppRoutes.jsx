// region imports
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import Home from "../pages/home/Home";
import CreateEmployee from "../pages/Employees/CreateEmployee";

// Layout
import MainLayout from "../layout/MainLayout";
// endregion

// region Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state?.auth ?? {});
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children ? children : <Outlet />;
};
// endregion

// region App Routes
const AppRoutes = () => {
    const { authChecked } = useSelector((state) => state.auth);
      if (!authChecked) return null; 
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/employees/create" element={<CreateEmployee />} />
          {/* add more protected pages here */}
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
// endregion

// region exports
export default AppRoutes;
// endregion
