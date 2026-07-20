const authService = {
  login: async (email, password) => {
    const rawName = email.split('@')[0] || 'User';
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    return { name, email };
  },
  signup: async (name, email, password) => {
    return { name, email };
  },
};

export default authService;