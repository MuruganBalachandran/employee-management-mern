// region imports
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { fetchCurrentUser } from "./features/auth/authSlice";
// endregion

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="container-fluid p-0">
        <AppRoutes />
      </div>
    </Router>
  );
};


// region exports
export default App;
// endregion
