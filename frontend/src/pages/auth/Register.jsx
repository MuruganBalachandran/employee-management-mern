// region imports
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import Input from "../../components/UI/Input";
import Loader from "../../components/UI/Loader";
import PasswordRules from "../../components/auth/PasswordRules";

import { register } from "../../features/auth/authSlice";
import { showToast } from "../../features/toast/toastSlice";

import {
  nameValidation,
  emailValidation,
  passwordValidation,
} from "../../validations/authValidation";
// endregion

// region component
const Register = () => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading = false } = useSelector((state) => state?.auth ?? {});
  // endregion

  // region form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  // endregion

  // region handle input changes with live validation
  const handleNameChange = (e) => {
    const value = e?.target?.value ?? "";
    setName(value);
    setFormErrors((prev) => ({ ...prev, name: nameValidation(value) }));
  };

  const handleEmailChange = (e) => {
    const value = e?.target?.value ?? "";
    setEmail(value);
    setFormErrors((prev) => ({ ...prev, email: emailValidation(value) }));
  };

  const handlePasswordChange = (e) => {
    const value = e?.target?.value ?? "";
    setPassword(value);

    // Validate password
    setFormErrors((prev) => ({ ...prev, password: passwordValidation(value) }));

    // Confirm password match
    if (confirmPassword && value !== confirmPassword) {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e?.target?.value ?? "";
    setConfirmPassword(value);

    if (value !== password) {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };
  // endregion

  // region handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // client-side validation
    const errors = {
      name: nameValidation(name),
    email: emailValidation(email, "admin"),
      password: passwordValidation(password),
      confirmPassword: !confirmPassword
        ? "Confirm Password is required"
        : password !== confirmPassword
        ? "Passwords do not match"
        : "",
    };

    // filter out empty errors
    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value)
    );

    if (Object.keys(filteredErrors).length > 0) {
      setFormErrors(filteredErrors);
      return;
    }

    // dispatch register action
    try {
      await dispatch(register({ name, email, password }))?.unwrap();
      // show success toast (optional)
      // dispatch(showToast({ message: "Registered successfully!", type: "success" }));
      navigate("/login");
    } catch (err) {
      console.error(err ?? "Registration failed");
      dispatch(showToast({ message: "Registration failed!", type: "error" }));
    }
  };
  // endregion

  // region render
  return (
<div className="auth-page d-flex justify-content-center align-items-center min-vh-100 p-3">

  {/* Loader */}
  {loading && <Loader fullScreen text="Registering..." />}

  <form
    className="auth-form card p-4 shadow-sm w-100"
    style={{ maxWidth: "400px" }}
    onSubmit={handleSubmit}
    noValidate
  >
    {/* Form heading */}
    <h2 className="mb-4 text-center">Register</h2>

    {/* Name input */}
    <Input
      label="Name"
      value={name}
      onChange={handleNameChange}
      error={formErrors?.name}
      placeholder="Enter your name"
    />

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
      placeholder="Enter a strong password"
    />

    {/* Password rules */}
    <PasswordRules password={password} />

    {/* Confirm Password input */}
    <Input
      label="Confirm Password"
      type="password"
      value={confirmPassword}
      onChange={handleConfirmPasswordChange}
      error={formErrors?.confirmPassword}
      placeholder="Confirm your password"
    />

    {/* Submit button */}
    <button type="submit" className="btn btn-primary w-100 mt-3">
      Register
    </button>

    {/* Link to login */}
    <p className="text-center mt-3">
      Already have an account?{" "}
      <Link to="/login" className="fw-bold text-primary text-decoration-none">
        Login
      </Link>
    </p>
  </form>
</div>

  );
  // endregion
};
// endregion

// region exports
export default Register;
// endregion
