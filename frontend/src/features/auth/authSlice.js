// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  registerUser,
  getCurrentUser,
} from "../../services/authService";
// endregion

// region initial state
const initialState = {
  user: null,        // currently logged-in user
  loading: false,
  error: null,
  isAuthenticated: false,
  authChecked: false,
};
// endregion

// region async thunks

// login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginUser(credentials);
      // set token correctly
      localStorage.setItem("token", res?.data?.data?.token ?? "");
      return res?.data?.data?.user ?? null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Login failed"
      );
    }
  }
);


export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUser(data);
      return res?.data?.data?.user ?? null; // only return user
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed"
      );
    }
  }
);



// logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      return null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Logout failed"
      );
    }
  }
);

// fetch current user
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCurrentUser();
      return res?.data ?? null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to fetch user"
      );
    }
  }
);

// endregion

// region slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload ?? null;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
        state.isAuthenticated = false;
      })

      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload ?? null;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
        state.isAuthenticated = false;
      })

      // logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

      // fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload ?? null;
          state.isAuthenticated = !!action.payload;
         state.authChecked = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
        state.user = null;
        state.isAuthenticated = false;
         state.authChecked = true;
      });
  },
});
// endregion

// region exports
export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
// endregion
