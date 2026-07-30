import User from "../models/User.js";
import { createToken } from "../utils/token.js";

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email });
const validEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !validEmail(email) || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "Name, a valid email, and a password of at least 6 characters are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ message: "An account already exists for this email." });
    }

    const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
    return res.status(201).json({ token: createToken(user.id), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An account already exists for this email." });
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!validEmail(email) || typeof password !== "string") {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({ token: createToken(user.id), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}
