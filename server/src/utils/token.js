import jwt from "jsonwebtoken";

const getSecret = () => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET must be configured.");
  return process.env.JWT_SECRET;
};

// Access tokens are deliberately short-lived. Persistent sessions use an opaque,
// rotating refresh token stored in an HTTP-only cookie.
export const createToken = (userId) => jwt.sign({ id: userId }, getSecret(), { expiresIn: "15m" });
export const verifyToken = (token) => jwt.verify(token, getSecret());
