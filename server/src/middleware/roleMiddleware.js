import User from "../models/User.js";

export function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("role").lean();
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: "You do not have permission to perform this action." });
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
