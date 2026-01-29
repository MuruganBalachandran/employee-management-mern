// region imports
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/home/Home";
import CreateEmployee from "../pages/employees/CreateEmployee";
import EditEmployee from "../pages/employees/EditEmployee";
import EmployeeView from "../pages/employees/EmployeeView";
import MyProfile from "../pages/employees/MyProfile";
import NotFound from "../pages/NotFound";

// Layout
import MainLayout from "../layout/MainLayout";
// endregion

// region Protected Route component
const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
// endregion

// region Admin Route component
const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/me" replace />;
};
// endregion

// region App Routes
const AppRoutes = () => {
  const { authChecked } = useSelector((state) => state.auth);
  if (!authChecked) return null;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          {/* Employee self profile */}
          <Route path="/me" element={<MyProfile />} />

          {/* Admin only */}
          <Route element={<AdminRoute />}>
            <Route path="/employees/create" element={<CreateEmployee />} />
            <Route path="/employees/edit/:id" element={<EditEmployee />} />
            <Route path="/employees/view/:id" element={<EmployeeView />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
