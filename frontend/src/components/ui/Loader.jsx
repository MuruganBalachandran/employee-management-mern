// region imports
import React from "react";
// endregion

const Loader = ({
  size = "medium", // small | medium | large
  text = "",
  fullScreen = false,
}) => {
  const spinnerSize = size === "small" ? "spinner-border-sm" : size === "large" ? "spinner-border-lg" : "";

  return (
    <div className={`d-flex flex-column justify-content-center align-items-center ${fullScreen ? "position-fixed top-0 start-0 vw-100 vh-100 bg-light bg-opacity-50" : ""}`} style={fullScreen ? { zIndex: 1050 } : {}}>
      <div className={`spinner-border text-primary ${spinnerSize}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-2">{text}</p>}
    </div>
  );
};

export default Loader;
