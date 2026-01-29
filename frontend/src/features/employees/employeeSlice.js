// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employeeService";
import { showToast } from "../toast/toastSlice";
// endregion

// region initialState
const initialState = {
  employees: [],
  count: 0,
  currentEmployee: null,
  loading: false,
  error: null,
};
// endregion

// region Async Thunks

// region getEmployees
export const getEmployees = createAsyncThunk(
  "employees/getEmployees",
  async (
    { skip = 0, limit = 5, search = "", department = "", ignoreFilters = false } = {},
    { rejectWithValue } = {}
  ) => {
    try {
      const res = await fetchEmployees({ skip, limit, search, department, ignoreFilters });
      return {
        items: res?.data?.data?.items ?? [],
        count: res?.data?.data?.count ?? 0,
      };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message ?? "Failed to fetch employees");
    }
  }
);

// endregion

// region getEmployee
export const getEmployee = createAsyncThunk(
  "employees/getEmployee",
  async (id = null, { rejectWithValue } = {}) => {
    /* Fetch single employee by ID */
    try {
      const res = await fetchEmployeeById?.(id ?? null);
      return res?.data?.data?.employee ?? null;
    } catch (err) {
      return rejectWithValue?.(
        err?.response?.data?.message ?? "Failed to fetch employee"
      );
    }
  }
);
// endregion

// region addEmployee
export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (data = {}, { rejectWithValue, dispatch } = {}) => {
    /* Add a new employee */
    try {
      const res = await createEmployee?.(data ?? {});
      dispatch?.(showToast?.({ message: "Employee added!", type: "success" }));
      return res?.data ?? {};
    } catch (err) {
      const backend = err?.response?.data ?? {};

      if (backend?.error && typeof backend?.error === "object") {
        return rejectWithValue?.(backend?.error ?? {});
      }

      return rejectWithValue?.({
        message:
          backend?.message ??
          err?.message ??
          "Failed to add employee",
      });
    }
  }
);
// endregion

// region editEmployee
export const editEmployee = createAsyncThunk(
  "employees/editEmployee",
  async ({ id = null, data = {} } = {}, { rejectWithValue } = {}) => {
    /* Update existing employee */
    try {
      const res = await updateEmployee?.(id ?? null, data ?? {});
      return res?.data ?? null;
    } catch (err) {
      return rejectWithValue?.(
        err?.response?.data?.message ?? "Failed to update employee"
      );
    }
  }
);
// endregion

// region removeEmployee
export const removeEmployee = createAsyncThunk(
  "employees/removeEmployee",
  async (id = null, { rejectWithValue } = {}) => {
    /* Delete employee */
    try {
      await deleteEmployee?.(id ?? null);
      return id ?? null;
    } catch (err) {
      return rejectWithValue?.(
        err?.response?.data?.message ?? "Failed to delete employee"
      );
    }
  }
);
// endregion




// endregion

// region slice
const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    // region clearCurrentEmployee
    clearCurrentEmployee: (state = {}) => {
      /* Reset current employee state */
      state.currentEmployee = null;
      state.error = null;
      state.loading = false;
    },
    // endregion
  },
  extraReducers: (builder) => {
    builder

      // region getEmployees reducers
      .addCase(getEmployees?.pending, (state = {}) => {
        /* Loading employees */
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployees?.fulfilled, (state = {}, action = {}) => {
        /* Employees fetched */
        state.loading = false;
        state.employees = action?.payload?.items ?? [];
        state.count = action?.payload?.count ?? 0;
      })
      .addCase(getEmployees?.rejected, (state = {}, action = {}) => {
        /* Employees fetch failed */
        state.loading = false;
        state.error = action?.payload ?? "Unknown error";
      })
      // endregion

      // region getEmployee reducers
      .addCase(getEmployee?.pending, (state = {}) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployee?.fulfilled, (state = {}, action = {}) => {
        state.loading = false;
        state.currentEmployee = action?.payload ?? null;
      })
      .addCase(getEmployee?.rejected, (state = {}, action = {}) => {
        state.loading = false;
        state.error = action?.payload ?? "Unknown error";
      })
      // endregion

      // region addEmployee reducers
      .addCase(addEmployee?.pending, (state = {}) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee?.fulfilled, (state = {}, action = {}) => {
        state.loading = false;
        state.employees?.push?.(action?.payload ?? {});
      })
      .addCase(addEmployee?.rejected, (state = {}, action = {}) => {
        state.loading = false;
        state.error = action?.payload ?? "Unknown error";
      })
      // endregion

      // region editEmployee reducers
      .addCase(editEmployee?.pending, (state = {}) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editEmployee?.fulfilled, (state = {}, action = {}) => {
        state.loading = false;
        const updatedEmp = action?.payload?.employee ?? action?.payload ?? null;

        const index = state?.employees?.findIndex?.(
          (emp = {}) => emp?._id === updatedEmp?._id
        );

        if (index !== -1 && index !== undefined) {
          state.employees[index] = updatedEmp;
        }
      })
      .addCase(editEmployee?.rejected, (state = {}, action = {}) => {
        state.loading = false;
        state.error = action?.payload ?? "Unknown error";
      })
      // endregion

      // region removeEmployee reducers
      .addCase(removeEmployee?.pending, (state = {}) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeEmployee?.fulfilled, (state = {}, action = {}) => {
        state.loading = false;
        state.employees = state?.employees?.filter?.(
          (emp = {}) => emp?._id !== action?.payload
        ) ?? [];
      })
      .addCase(removeEmployee?.rejected, (state = {}, action = {}) => {
        state.loading = false;
        state.error = action?.payload ?? "Unknown error";
      });
    // endregion
  },
});
// endregion

// region exports
export const { clearCurrentEmployee } = employeeSlice?.actions ?? {};
export default employeeSlice?.reducer;
// endregion
