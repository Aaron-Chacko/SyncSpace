import { verifyToken } from "../utils/token.js";

export default function authMiddleware(req, res, next) {
  const header = req.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "A Bearer token is required." });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: "Token is invalid or expired." });
  }
}
