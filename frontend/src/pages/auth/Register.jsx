// region imports
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearAuthError } from "../../features/auth/authSlice";
import Input from "../../components/UI/Input";
import Loader from "../../components/UI/Loader";
import Toaster from "../../components/UI/Toaster";
import PasswordRules from "../../components/auth/PasswordRules";
import {
  nameValidation,
  emailValidation,
  passwordValidation,
} from "../../validations/authValidation";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// endregion

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state?.auth ?? {});

  // region form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);
  // endregion

  // region show backend error from Redux state
  useEffect(() => {
    if (error) {
      setToast(error); // show exact backend error
      dispatch(clearAuthError()); // clear it after showing
    }
  }, [error, dispatch]);
  // endregion

  // region handle change with live validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setFormErrors((prev) => ({ ...prev, name: nameValidation(value) }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setFormErrors((prev) => ({ ...prev, email: emailValidation(value) }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setFormErrors((prev) => ({ ...prev, password: passwordValidation(value) }));

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
    const value = e.target.value;
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

  // region handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // client-side validation
    const errors = {
      name: nameValidation(name),
      email: emailValidation(email),
      password: passwordValidation(password),
      confirmPassword: !confirmPassword
        ? "Confirm Password is required"
        : password !== confirmPassword
          ? "Passwords do not match"
          : "",
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v),
    );

    if (Object.keys(filteredErrors).length > 0) {
      setFormErrors(filteredErrors);
      return;
    }

    // dispatch register and handle backend errors
    try {
      await dispatch(register({ name, email, password })).unwrap();
      setToast("Registered successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFormErrors({});
      navigate("/login");
    } catch (err) {
      // err contains exact backend error from rejectWithValue
      setToast(err ?? "Registration failed");
    }
  };
  // endregion

  return (
    <div className='auth-page login-page d-flex justify-content-center align-items-center vh-100 mt-5'>
      {loading && <Loader fullScreen text='Registering...' />}
      {toast && (
        <Toaster
          message={toast}
          type={
            String(toast).toLowerCase().includes("success")
              ? "success"
              : "error"
          }
          onClose={() => setToast(null)}
        />
      )}

      <form
        className='auth-form card p-4 shadow-sm w-100'
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className='mb-4 text-center'>Register</h2>

        <Input
          label='Name'
          value={name}
          onChange={handleNameChange}
          error={formErrors?.name}
          placeholder='Enter your name'
        />
        <Input
          label='Email'
          type='email'
          value={email}
          onChange={handleEmailChange}
          error={formErrors?.email}
          placeholder='Enter your email'
        />
        <Input
          label='Password'
          type='password'
          value={password}
          onChange={handlePasswordChange}
          error={formErrors?.password}
          placeholder='Enter a strong password'
        />
        <PasswordRules password={password} />
        <Input
          label='Confirm Password'
          type='password'
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={formErrors?.confirmPassword}
          placeholder='Confirm your password'
        />

        <button type='submit' className='btn btn-primary w-100 mt-3'>
          Register
        </button>
        <p className='text-center mt-3'>
          If you already have an account{" "}
          <Link
            to='/login'
            className='fw-bold text-primary text-decoration-none'
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

// region exports
export default Register;
// endregion
