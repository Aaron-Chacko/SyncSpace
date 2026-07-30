import api from "./api";

const authService = {
  login: async (email, password) => (await api.post("/auth/login", { email, password })).data,
  signup: async (name, email, password) => (await api.post("/auth/signup", { name, email, password })).data,
};

export default authService;
