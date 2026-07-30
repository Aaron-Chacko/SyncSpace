const authService = {
  login: async (email, password) => {
    return { name: 'User', email };
  },
  signup: async (name, email, password) => {
    return { name, email };
  },
};

export default authService;