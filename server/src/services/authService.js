const User = require('../models/User');
const generateToken = require('../utils/generateToken');

class AuthService {
  async signup({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return {
      token,
      user: { id: user._id, name: user.name, email: user.email },
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id);

    return {
      token,
      user: { id: user._id, name: user.name, email: user.email },
    };
  }
}

module.exports = new AuthService();
