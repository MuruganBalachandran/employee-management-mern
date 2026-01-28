// region imports
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import Toaster from "./components/ui/Toaster";
import { fetchCurrentUser, setAuthChecked } from "./features/auth/authSlice";
// endregion

// region main App component
const App = () => {
  const dispatch = useDispatch();

  // region mounting
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchCurrentUser());
    } else {
      dispatch(setAuthChecked());
    }
  }, [dispatch]);
  // endregion

  return (
    <Router>
      <div className='container-fluid p-0'>
        {/* Global toaster for notifications */}
        <Toaster />

        {/* App Routes */}
        <AppRoutes />
      </div>
    </Router>
  );
};
// endregion

// region exports
export default App;
// endregion
