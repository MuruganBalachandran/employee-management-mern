import api from "./api";

// Create a new admin (Super Admin only)
export const createAdmin = (data) => api.post("/super-admin/create-admin", data);

// Delete an admin (Super Admin only)
export const deleteAdmin = (id) => api.delete(`/super-admin/delete-admin/${id}`);
