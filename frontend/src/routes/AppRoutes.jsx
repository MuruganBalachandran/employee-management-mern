// region imports
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Selectors
import {
  selectIsAuthenticated,
  selectAuthChecked,
  selectIsAdmin,
  selectIsSuperAdmin,
} from "../features/auth/authSelectors";

// Pages
import Login from "../pages/auth/Login"
import Home from "../pages/common/Home";
import CreateEmployee from "../pages/employees/CreateEmployee";
import EditEmployee from "../pages/employees/EditEmployee";
import EmployeeView from "../pages/employees/EmployeeView";
import MyProfile from "../pages/common/MyProfile"
import CreateAdmin from "../pages/SuperAdmin/CreateAdmin";
import ViewEmployees from "../pages/Employees/ViewEmployees";
import NotFound from "../pages/common/NotFound";

// Layout
import MainLayout from "../layout/MainLayout";
import EditProfile from "../pages/common/EditProfile";
// endregion

// region Protected Route component
const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
// endregion

// region Super Admin Route component
const SuperAdminRoute = () => {
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  return isSuperAdmin ? <Outlet /> : <Navigate to="/me" replace />;
};
// endregion

// region Admin Route component
const AdminRoute = () => {
  const isAdmin = useSelector(selectIsAdmin);
  return isAdmin ? <Outlet /> : <Navigate to="/me" replace />;
};
// endregion

const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/me" replace /> : <Outlet />;
};


// region App Routes
const AppRoutes = () => {
  const authChecked = useSelector(selectAuthChecked);
  if (!authChecked) return null;

  return (
    <Routes>
<Route element={<PublicRoute />}>
  <Route path="/login" element={<Login />} />
</Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          {/* Employee self profile */}
          <Route path="/me" element={<MyProfile />} />
     <Route path="/me/edit" element={<EditProfile />} />

          {/* Admin only */}
          <Route element={<AdminRoute />}>
            <Route path="/employees" element={<ViewEmployees />} />
            <Route path="/employees/create" element={<CreateEmployee />} />
            <Route path="/employees/edit/:id" element={<EditEmployee />} />
            <Route path="/employees/view/:id" element={<EmployeeView />} />
          </Route>

          {/* Super Admin only */}
          <Route element={<SuperAdminRoute />}>
            <Route path="/create-admin" element={<CreateAdmin />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
