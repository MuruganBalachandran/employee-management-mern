// region imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employeeService";
// endregion

// region initial state
const initialState = {
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,
};
// endregion

// region async thunks

export const getEmployees = createAsyncThunk(
  "employees/getEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchEmployees();
      return res.data ?? [];
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message ?? "Failed to fetch employees");
    }
  }
);

export const getEmployee = createAsyncThunk(
  "employees/getEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetchEmployeeById(id);
      return res.data ?? null;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message ?? "Failed to fetch employee");
    }
  }
);

export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createEmployee(data);
      return res.data ?? null;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message ?? "Failed to add employee");
    }
  }
);

export const editEmployee = createAsyncThunk(
  "employees/editEmployee",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateEmployee(id, data);
      return res.data ?? null;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message ?? "Failed to update employee");
    }
  }
);

export const removeEmployee = createAsyncThunk(
  "employees/removeEmployee",
  async (id, { rejectWithValue }) => {
    try {
      await deleteEmployee(id);
      return id;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message ?? "Failed to delete employee");
    }
  }
);

// endregion

// region slice
const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // getEmployees
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload ?? [];
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

      // getEmployee
      .addCase(getEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload ?? null;
      })
      .addCase(getEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

      // addEmployee
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload ?? {});
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

      // editEmployee
      .addCase(editEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(
          (emp) => emp?.id === action.payload?.id
        );
        if (index !== -1) state.employees[index] = action.payload ?? {};
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

      // removeEmployee
      .addCase(removeEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(
          (emp) => emp?.id !== action.payload
        );
      })
      .addCase(removeEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});
// endregion

// region exports
export const { clearCurrentEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
// endregion
