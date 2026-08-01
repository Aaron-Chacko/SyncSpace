import User from "../models/User.js";

// Admin-only account overview. Sensitive fields (passwords and session tokens)
// are never selected or returned.
export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select("_id name email role emailVerified createdAt").sort({ createdAt: -1 }).lean();
    return res.json({ users: users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })) });
  } catch (error) {
    return next(error);
  }
}
