// region imports
import api from "./api";
// endregion

// region auth services
// register endpoint removed as per backend restriction
// export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data = {}) => api.post("/auth/login", data);

export const logoutUser = () => api.post("/auth/logout");

export const getCurrentUser = () => api.get("/users/getProfile");

export const editCurrentUser = (data = {}) => api.patch("/users/updateProfile", data);
// endregion
