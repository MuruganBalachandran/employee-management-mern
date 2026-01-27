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
  console.log(user)
  // endregion
  // region handleLogout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  // endrgion

  return (
    <header className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <div className='container'>
        <Link className='navbar-brand' to='/'>
          Employee Management
        </Link>
        <div className='collapse navbar-collapse justify-content-end'>
          {user ? (
            <div className='d-flex align-items-center gap-2'>
              <span className="text-white me-2">Hi, {user?.data?.user?.name}</span>
              <button
                className='btn btn-outline-light btn-sm'
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='d-flex gap-2'>
              <Link className='btn btn-outline-light btn-sm' to='/login'>
                Login
              </Link>
              <Link className='btn btn-outline-light btn-sm' to='/register'>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// region exports
export default Header;
// endregion
