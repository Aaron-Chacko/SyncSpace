import api from "./api";

const authService = {
  login: async (email, password) => (await api.post("/auth/login", { email, password })).data,
  signup: async (name, email, password) => (await api.post("/auth/signup", { name, email, password })).data,
  refresh: async () => (await api.post("/auth/refresh")).data,
  logout: async () => api.post("/auth/logout"),
  requestPasswordReset: async (email) => (await api.post("/auth/forgot-password", { email })).data,
  resetPassword: async (token, password) => (await api.post("/auth/reset-password", { token, password })).data,
};

export default authService;
