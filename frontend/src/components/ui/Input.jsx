// region imports
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// endregion

// region component
const Input = ({
  label = "",
  name = "",
  value = "",
  onChange = () => {},
  type = "text",
  placeholder = "",
  error = "",
  disabled = false,
  required = false,
  icon = null,
  textarea = false,
  rows = 3,
  options = [],
  select = false,
}) => {
  // region state
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  // endregion

  // region handlers
  const togglePassword = () => {
    /* Toggle password visibility */
    setShowPassword((prev = false) => !prev);
  };
  // endregion

  return (
    <div className='mb-3'>
      {/* Label Section */}
      {label && (
        <label htmlFor={name} className='form-label'>
          {label} {required && <span className='text-danger'>*</span>}
        </label>
      )}

      <div className='input-group'>
        {/* Optional icon */}
        {icon && <span className='input-group-text'>{icon}</span>}

        {/* Textarea Field */}
        {textarea ? (
          <>
            {/* Multiline input */}
            <textarea
              id={name}
              name={name}
              value={value ?? ""}
              onChange={onChange}
              placeholder={placeholder}
              rows={rows}
              disabled={disabled}
              className={`form-control ${error ? "is-invalid" : ""}`}
            />
          </>
        ) : select ? (
          <>
            {/* Select Dropdown */}
            <select
              id={name}
              name={name}
              value={value ?? ""}
              onChange={onChange}
              disabled={disabled}
              className={`form-select ${error ? "is-invalid" : ""}`}
            >
              {options?.length === 0 && (
                <option value=''>Select an option</option>
              )}
              {options?.map?.((opt = {}) => (
                <option key={opt?.value} value={opt?.value}>
                  {opt?.label}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            {/* Standard Input */}
            <input
              id={name}
              name={name}
              value={value ?? ""}
              onChange={onChange}
              type={isPassword && showPassword ? "text" : type}
              placeholder={placeholder}
              disabled={disabled}
              className={`form-control ${error ? "is-invalid" : ""}`}
            />
          </>
        )}

        {/* Password Toggle Button */}
        {isPassword && (
          <span
            className='input-group-text'
            style={{ cursor: "pointer" }}
            onClick={togglePassword}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}

        {/* Validation Error Message */}
        {error && <div className='invalid-feedback'>{error}</div>}
      </div>
    </div>
  );
};
// endregion

// region exports
export default Input;
// endregion
