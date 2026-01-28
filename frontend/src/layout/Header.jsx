// region imports
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
// endregion

const Header = () => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.user ?? null);
  // endregion

  // region handleLogout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  // endregion

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        {/* Home link */}
        <Link className="navbar-brand" to="/">
          Employee Management
        </Link>

        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav d-flex align-items-center gap-2">
            {/* Add Employee nav link */}
            <li className="nav-item">
              <Link to="/employees/create" className="nav-link text-light">
                Add Employee
              </Link>
            </li>

            {/* Logout button */}
            {user && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

// region exports
export default Header;
// endregion
