// region imports
import React from "react";
// endregion

// region component
const Loader = ({
  size = "medium", // small | medium | large
  text = "",
  fullScreen = false,
} = {}) => {
  // region derived values
  /* Decide spinner size class */
  const spinnerSize =
    size === "small"
      ? "spinner-border-sm"
      : size === "large"
      ? "spinner-border-lg"
      : "";
  // endregion

  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center ${
        fullScreen
          ? "position-fixed top-0 start-0 vw-100 vh-100 bg-light bg-opacity-50"
          : ""
      }`}
      style={fullScreen ? { zIndex: 1050 } : {}}
    >
      {/* Spinner */}
      <div className={`spinner-border text-primary ${spinnerSize}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>

      {/* Optional loading text */}
      {text && <p className="mt-2">{text}</p>}
    </div>
  );
};
// endregion

// region exports
export default Loader;
// endregion
