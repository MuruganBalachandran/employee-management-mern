// region imports
import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "../features/employees/employeeSlice";
import authReducer from "../features/auth/authSlice";
// endregion

// region store
const store = configureStore({
  reducer: {
    employees: employeeReducer,
    auth: authReducer,
  },
});
// endregion

// region exports
export default store;
// endregion
