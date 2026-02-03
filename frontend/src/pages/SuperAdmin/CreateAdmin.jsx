// region imports
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/UI/Input";
import Loader from "../../components/UI/Loader";
import PasswordRules from "../../components/auth/PasswordRules";

import { createNewAdmin } from "../../features/superAdmin/superAdminSlice";
import { selectSuperAdminLoading } from "../../features/superAdmin/superAdminSelectors";
import { showToast } from "../../features/toast/toastSlice";

import {
  nameValidation,
  emailValidation,
  passwordValidation,
} from "../../validations/authValidation";
// endregion

// region component
const CreateAdmin = () => {
  // region hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectSuperAdminLoading);
  // endregion

  // region form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  // endregion

  // region handle input changes with live validation
  const handleNameChange = (e) => {
    const value = e?.target?.value || "";
    setName(value);
    setFormErrors((prev) => ({ ...prev, name: nameValidation(value) }));
  };

  const handleEmailChange = (e) => {
    const value = e?.target?.value || "";
    setEmail(value);
    // Custom validation for @spanadmin.com
    let errorMsg = emailValidation(value, "admin");
    setFormErrors((prev) => ({ ...prev, email: errorMsg }));
  };

  const handlePasswordChange = (e) => {
    const value = e?.target?.value || "";
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
    const value = e?.target?.value || "";
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

  const handleAgeChange = (e) => {
    const value = e?.target?.value || "";
    setAge(value);
    setFormErrors((prev) => ({
      ...prev,
      age: !value || Number(value) < 18 ? "Age must be at least 18" : "",
    }));
  };
  // endregion

  // region handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // client-side validation
    let emailError = emailValidation(email, "admin");

    const errors = {
      name: nameValidation(name),
      email: emailError,
      password: passwordValidation(password),
      confirmPassword: !confirmPassword
        ? "Confirm Password is required"
        : password !== confirmPassword
        ? "Passwords do not match"
        : "",
      age: !age || Number(age) < 18 ? "Age must be at least 18" : "",
    };

    // filter out empty errors
    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value)
    );

    if (Object.keys(filteredErrors).length > 0) {
      setFormErrors(filteredErrors);
      return;
    }

    // service call via Redux Thunk
    try {
      await dispatch(createNewAdmin({
        name,
        email,
        password,
        age: Number(age),
      })).unwrap();
      
      setSuccess("Admin created successfully!");
      
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAge("");
      setFormErrors({});
      
      navigate("/"); 
    } catch (err) {
      console.error(err);
      const msg = err || "Failed to create admin";
      setError(msg);
      // Toast is already shown by thunk
    }
  };
  // endregion

  // region render
  return (
    <div className="auth-page d-flex justify-content-center align-items-center min-vh-100 p-3">
      {/* Loader */}
      {loading && <Loader fullScreen text="Creating Admin..." />}

      <form
        className="auth-form card p-4 shadow-sm w-100"
        style={{ maxWidth: "500px" }}
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Form heading */}
        <h2 className="mb-4 text-center">Create New Admin</h2>

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        {/* Name input */}
        <Input
          label="Name"
          value={name}
          onChange={handleNameChange}
          error={formErrors?.name}
          placeholder="Admin Name"
        />

        {/* Email input */}
        <Input
          label="Email (@spanadmin.com)"
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={formErrors?.email}
          placeholder="admin@spanadmin.com"
        />

        {/* Age input */}
        <Input
          label="Age"
          type="number"
          value={age}
          onChange={handleAgeChange}
          error={formErrors?.age}
          placeholder="Age (min 18)"
          min="18"
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
          placeholder="Confirm password"
        />

        {/* Submit button */}
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Create Admin
        </button>
      </form>
    </div>
  );
  // endregion
};

export default CreateAdmin;
