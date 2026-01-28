// region imports
import axios from "axios";
// endregion

// region axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api", 
  withCredentials: true, 
});
// endregion

// region request interceptor (attach token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") ?? null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// endregion

// region response interceptor (handle errors globally)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
// endregion

// region exports
export default api;
// endregion
