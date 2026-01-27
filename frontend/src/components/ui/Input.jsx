// region imports
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// endregion

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
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="input-group">
        {icon && <span className="input-group-text">{icon}</span>}

        {textarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={`form-control ${error ? "is-invalid" : ""}`}
          />
        ) : (
          <input
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            type={isPassword && showPassword ? "text" : type}
            placeholder={placeholder}
            disabled={disabled}
            className={`form-control ${error ? "is-invalid" : ""}`}
          />
        )}

        {/* Eye toggle for password */}
        {isPassword && (
          <span
            className="input-group-text"
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}

        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
};

// region exports
export default Input;
// endregion
