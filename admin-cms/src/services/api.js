import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:5000/api" });

api.interceptors.request.use(cfg => {
  // check common storage keys
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token") || localStorage.getItem("auth_token");
  console.debug("API: sending token:", !!token);
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
