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
      email: !value ? "Email is required" : emailValidation(value),
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

    // client-side validation
    const errors = {
      email: !email ? "Email is required" : emailValidation(email),
      password: !password ? "Password is required" : passwordValidation(password),
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value)
    );

    if (Object.keys(filteredErrors).length > 0) {
      setFormErrors(filteredErrors);
      return;
    }

    // dispatch login action
    try {
      await dispatch(login({ email, password }))?.unwrap();
      setEmail("");
      setPassword("");
      setFormErrors({});
      navigate("/");

      // optional success toast
      dispatch(showToast({ message: "Logged in successfully!", type: "success" }));
    } catch (err) {
      // show backend error toast
      dispatch(
        showToast({ message: err?.message ?? "Login failed!", type: "error" })
      );
    }
  };
  // endregion

  // region render
  return (
<div className="auth-page d-flex justify-content-center align-items-center min-vh-100 p-3">

      {/* Loader */}
      {loading && <Loader fullScreen text="Logging in..." />}

      <form
        className="auth-form card p-4 shadow-sm w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Form heading */}
        <h2 className="mb-4 text-center">Login</h2>

        {/* Email input */}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={formErrors?.email}
          placeholder="Enter your email"
        />

        {/* Password input */}
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={formErrors?.password}
          placeholder="Enter your password"
        />

        {/* Submit button */}
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Login
        </button>

        {/* Link to register */}
        <p className="text-center mt-3">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="fw-bold text-primary text-decoration-none"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
  // endregion
};
// endregion

// region exports
export default Login;
// endregion
