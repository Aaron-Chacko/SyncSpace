import { Router } from "express";
import { login, signup, logout, refresh, requestPasswordReset, resetPassword, verifyEmail } from "../controllers/authController.js";
import { rateLimit } from "../middleware/rateLimitMiddleware.js";

const router = Router();
const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, key: (req) => `${req.ip}:${req.path}` });
router.post("/signup", authLimit, signup);
router.post("/login", authLimit, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", authLimit, requestPasswordReset);
router.post("/reset-password", authLimit, resetPassword);
export default router;
