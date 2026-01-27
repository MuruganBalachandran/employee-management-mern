// region imports
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearAuthError } from "../../features/auth/authSlice";
import Input from "../../components/UI/Input";
import Loader from "../../components/UI/Loader";
import Toaster from "../../components/UI/Toaster";
import {
  emailValidation,
  passwordValidation,
} from "../../validations/authValidation";
import { Link } from "react-router-dom";
// endregion

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state?.auth ?? {});

  // region form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);
  // endregion

  // region show backend errors
  useEffect(() => {
    if (error) {
      setToast(error); // show backend error
      dispatch(clearAuthError()); // clear after showing
    }
  }, [error, dispatch]);
  // endregion

  // region handle input changes with live validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setFormErrors((prev) => ({
      ...prev,
      email: !value ? "Email is required" : emailValidation(value),
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setFormErrors((prev) => ({
      ...prev,
      password: !value ? "Password is required" : passwordValidation(value),
    }));
  };
  // endregion

  // region handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // client-side validation
    const errors = {
      email: !email ? "Email is required" : emailValidation(email),
      password: !password
        ? "Password is required"
        : passwordValidation(password),
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v),
    );

    if (Object.keys(filteredErrors).length > 0) {
      setFormErrors(filteredErrors);
      return;
    }

    // dispatch login and handle backend errors
    try {
      const user = await dispatch(login({ email, password })).unwrap();
      setToast("Logged in successfully!");
      // clear form fields and errors
      setEmail("");
      setPassword("");
      setFormErrors({});
      navigate("/");
    } catch (err) {
      setToast(err ?? "Login failed");
    }
  };
  // endregion

  return (
    <div className='auth-page login-page d-flex justify-content-center align-items-center vh-100'>
      {loading && <Loader fullScreen text='Logging in...' />}
      {toast && (
        <Toaster
          message={toast}
          type={toast.includes("successfully") ? "success" : "error"}
          onClose={() => setToast(null)}
        />
      )}

      <form
        className='auth-form card p-4 shadow-sm w-100'
        style={{ maxWidth: "400px" }}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className='mb-4 text-center'>Login</h2>

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
          placeholder='Enter your password'
        />

        <button type='submit' className='btn btn-primary w-100 mt-3'>
          Login
        </button>
        <p className='text-center mt-3'>
          If you don't have an account{" "}
          <Link
            to='/register'
            className='fw-bold text-primary text-decoration-none'
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

// region exports
export default Login;
// endregion
