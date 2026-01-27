// region imports
import api from "./api";
// endregion

// region employee services
export const fetchEmployees = () => api.get("/employees");

export const fetchEmployeeById = (id) => api.get(`/employees/${id}`);

export const createEmployee = (data) => api.post("/employees", data);

export const updateEmployee = (id, data) =>
  api.put(`/employees/${id}`, data);

export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
// endregion
