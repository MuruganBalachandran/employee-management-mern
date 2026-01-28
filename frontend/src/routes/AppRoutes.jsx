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
import NotFound from "../pages/NotFound";

// Layout
import MainLayout from "../layout/MainLayout";
import EmployeeView from "../pages/employees/EmployeeView";
// endregion

// region Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated = false } = useSelector((state) => state?.auth ?? {});
  if (!isAuthenticated) return <Navigate to='/login' replace />;
  return children ?? <Outlet />;
};
// endregion

// region App Routes component
const AppRoutes = () => {
  const { authChecked = false } = useSelector((state) => state?.auth ?? {});

  // Show nothing until auth check is complete
  if (!authChecked) return null;

  return (
    <Routes>
      {/* Public routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/employees/create' element={<CreateEmployee />} />
          <Route path='/employees/edit/:id' element={<EditEmployee />} />
          <Route path="/employees/view/:id" element={<EmployeeView />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};
// endregion

// region exports
export default AppRoutes;
// endregion
