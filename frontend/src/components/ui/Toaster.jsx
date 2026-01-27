// region imports
import React, { useEffect } from "react";
// endregion

const Toaster = ({
  message="",
  type = "success", // success | error | info | warning
  duration = 3000,
  onClose=()=>{},
}) => {
  useEffect(() => {
    // timeout for close toaster
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
// clear timeout
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // if no message , then end the function
  if (!message){
return null;
  } 

  // region alert types
  const alertType = {
    success: "alert-success",
    error: "alert-danger",
    info: "alert-info",
    warning: "alert-warning",
  }[type];
  // endregion

  return (
    <div className={`alert ${alertType} alert-dismissible fade show position-fixed top-0 end-0 m-3`} role="alert" style={{ zIndex: 1050 }}>
      {message}
      <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
    </div>
  );
};

// region exports
export default Toaster;
// endregion
