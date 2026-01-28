// region imports
import api from "./api";
// endregion

// region fetch employees with pagination and filters
// region fetch employees with pagination and filters
export const fetchEmployees = ({
  skip = 0,
  limit = 5,
  search = "",
  department = "",
  ignoreFilters = false, // NEW FLAG
} = {}) => {
  const params = { skip, limit };
  if (!ignoreFilters) {
    if (search) params.search = search;
    if (department) params.department = department;
  }
  return api.get("/employees", { params });
};
// endregion

// endregion

export const fetchEmployeeById = (id) => api.get(`/employees/${id}`);

export const createEmployee = (data) => api.post("/employees", data);

// region update employee
export const updateEmployee = (id, data = {}) => {
  const payload = { ...data };

  // NEVER allow email updates
  delete payload.email;

  return api.put(`/employees/${id}`, payload);
};
// endregion

export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
// endregion
