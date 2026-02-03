// region imports
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../../features/toast/toastSlice";
import { selectToastData } from "../../features/toast/toastSelectors";
// endregion

// region component
const Toaster = ({ duration = 3000 }) => {
  // region hooks
  const dispatch = useDispatch();
  const { message, type, visible } = useSelector(selectToastData);
  // endregion

  // region auto-hide effect
  useEffect(() => {
    if (!visible) return;

    // set timeout to auto-hide toast
    const timer = setTimeout(() => {
      dispatch?.(hideToast?.());
    }, duration ?? 3000);

    return () => clearTimeout(timer);
  }, [visible, duration, dispatch]);
  // endregion

  // region guard
  if (!visible || !message) return null;
  // endregion

  // region alert type mapping
  const alertType = {
    success: "alert-success",
    error: "alert-danger",
    info: "alert-info",
    warning: "alert-warning",
  }[type ?? "info"] ?? "alert-info";
  // endregion

  // region render
  return (
    <div
      className={`alert ${alertType} alert-dismissible fade show position-fixed top-0 end-0 m-3 shadow`}
      role="alert"
      style={{ zIndex: 1050 }}
    >
      {/* message content */}
      {message}

      {/* close button */}
      <button
        type="button"
        className="btn-close"
        onClick={() => dispatch?.(hideToast?.())}
      />
    </div>
  );
  // endregion
};
// endregion

// region exports
export default Toaster;
// endregion
