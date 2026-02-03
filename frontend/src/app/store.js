// region imports
import { configureStore } from "@reduxjs/toolkit";

import employeeReducer from "../features/employees/employeeSlice";
import authReducer from "../features/auth/authSlice";
import superAdminReducer from "../features/superAdmin/superAdminSlice";
import toastReducer from "../features/toast/toastSlice";
// endregion

// region middleware
/**
 * Custom logger middleware for development
 * Logs actions and state changes for debugging
 */
const loggerMiddleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === "development") {
    console.group(action.type);
    console.info("dispatching", action);
    const result = next(action);
    console.log("next state", store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};

/**
 * Error handler middleware
 * Catches and logs unhandled errors from thunks
 */
const errorHandlerMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error("Middleware caught error:", error);
    throw error;
  }
};
// endregion

// region store configuration
const store = configureStore({
  reducer: {
    employees: employeeReducer,
    auth: authReducer,
    superAdmin: superAdminReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        // (if you store non-serializable values in the future)
        ignoredActions: ["auth/login/rejected", "auth/logout/rejected"],
        // Ignore these paths in the state
        ignoredPaths: [],
      },
    }).concat(loggerMiddleware, errorHandlerMiddleware),
  devTools: process.env.NODE_ENV === "development",
});
// endregion

// region exports
export default store;
// endregion
