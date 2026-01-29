// region imports
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import Input from "../../components/UI/Input";
import Loader from "../../components/UI/Loader";

import { login } from "../../features/auth/authSlice";
import { showToast } from "../../features/toast/toastSlice";
import { emailValidation, passwordValidation } from "../../validations/authValidation";
// endregion

// region component
const Login = () => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading = false } = useSelector((state) => state?.auth ?? {});
  // endregion

  // region form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  // endregion

  // region handle input changes with live validation
  const handleEmailChange = (e) => {
    const value = e?.target?.value ?? "";
    setEmail(value);
    setFormErrors((prev) => ({
      ...prev,
      email: !value ? "Email is required" : emailValidation(value, "login"),
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e?.target?.value ?? "";
    setPassword(value);
    setFormErrors((prev) => ({
      ...prev,
      password: !value ? "Password is required" : passwordValidation(value),
    }));
  };
  // endregion

  // region handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      email: !email ? "Email is required" : emailValidation(email, "login"),
      password: !password ? "Password is required" : passwordValidation(password),
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value)
    );

    if (Object.keys(filteredErrors).length > 0) {
      setFormErrors(filteredErrors);
      return;
    }

    try {
      const user = await dispatch(login({ email, password }))?.unwrap();

      setEmail("");
      setPassword("");
      setFormErrors({});

      // redirect based on role
      if (user?.role === "employee") navigate("/me");
      else navigate("/");

    } catch (err) {
      dispatch(
        showToast({ message: err ?? "Login failed!", type: "error" })
      );
    }
  };
  // endregion

  // region render
  return (
    <div className="auth-page d-flex justify-content-center align-items-center min-vh-100 p-3">
      {loading && <Loader fullScreen text="Logging in..." />}

      <form
        className="auth-form card p-4 shadow-sm w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="mb-4 text-center">Login</h2>

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={formErrors?.email}
          placeholder="Enter your email"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={formErrors?.password}
          placeholder="Enter your password"
        />

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Login
        </button>

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="fw-bold text-primary text-decoration-none">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};
// endregion

// region exports
export default Login;
// endregion
