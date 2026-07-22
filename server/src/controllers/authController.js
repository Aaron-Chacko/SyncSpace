import authService from "../services/AuthService.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password",
      });
    }

    const result = await authService.signup({
      name,
      email,
      password,
    });

    return res.status(201).json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const result = await authService.login({
      email,
      password,
    });

    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Server error",
    });
  }
};
