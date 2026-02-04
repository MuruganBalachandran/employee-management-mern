// region imports
import { createSlice } from "@reduxjs/toolkit";
// endregion

// region initial state
const initialState = {
  message: "",
  type: "info", // success | error | warning | info
  visible: false,
};
// endregion

// region slice
const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    // region showToast
    showToast: (state = {}, action = {}) => {
      /* Display toast message */
      state.message = action?.payload?.message || "";
      state.type = action?.payload?.type || "info";
      state.visible = true;
    },
    // endregion

    // region hideToast
    hideToast: (state = {}) => {
      /* Hide toast and reset message */
      state.visible = false;
      state.message = "";
    },
    // endregion
  },
});
// endregion

// region exports
export const { showToast, hideToast } = toastSlice?.actions || {};
export default toastSlice?.reducer;
// endregion
