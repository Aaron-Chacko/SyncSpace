import crypto from "crypto";
import User from "../models/User.js";
import { createToken } from "../utils/token.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "../services/emailService.js";

const REFRESH_COOKIE = "syncspace_refresh";
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const LOCK_TTL_MS = 15 * 60 * 1000;
const MAX_LOGIN_FAILURES = 5;

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified });
const validEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const validPassword = (password) => typeof password === "string" && password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const randomToken = () => crypto.randomBytes(32).toString("hex");

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: REFRESH_TTL_MS,
  path: "/api/auth",
});

const readCookie = (req, name) => Object.fromEntries(
  (req.headers.cookie ?? "").split(";").map((item) => item.trim().split("=")).filter(([key]) => key),
)[name];

async function issueSession(user, res) {
  const refreshToken = randomToken();
  const now = new Date();
  user.refreshTokens = (user.refreshTokens ?? [])
    .filter((entry) => entry.expiresAt > now)
    .slice(-4);
  user.refreshTokens.push({ tokenHash: hash(refreshToken), expiresAt: new Date(Date.now() + REFRESH_TTL_MS) });
  await user.save();
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());
  return { token: createToken(user.id), user: publicUser(user) };
}

async function createVerificationToken(user) {
  const token = randomToken();
  user.emailVerificationTokenHash = hash(token);
  user.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();
  return token;
}

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !validEmail(email) || !validPassword(password)) {
      return res.status(400).json({ message: "Use a valid email and a password with at least 8 characters, including uppercase, lowercase, and a number." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: "An account already exists for this email." });

    const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
    const verificationToken = await createVerificationToken(user);
    sendVerificationEmail(user.email, verificationToken).catch((error) => console.error("Verification email failed:", error.message));
    return res.status(201).json({ ...(await issueSession(user, res)), message: "Account created. Please verify your email." });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An account already exists for this email." });
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!validEmail(email) || typeof password !== "string") return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password +failedLoginAttempts +lockUntil +refreshTokens");
    if (!user) return res.status(401).json({ message: "Invalid email or password." });
    if (user.lockUntil && user.lockUntil > new Date()) return res.status(423).json({ message: "Account temporarily locked. Please try again later." });

    if (!(await user.comparePassword(password))) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_LOGIN_FAILURES) {
        user.lockUntil = new Date(Date.now() + LOCK_TTL_MS);
        user.failedLoginAttempts = 0;
      }
      await user.save();
      return res.status(401).json({ message: "Invalid email or password." });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    return res.json(await issueSession(user, res));
  } catch (error) {
    return next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const refreshToken = readCookie(req, REFRESH_COOKIE);
    if (!refreshToken) return res.status(401).json({ message: "Session expired. Please log in again." });
    const tokenHash = hash(refreshToken);
    const user = await User.findOne({ "refreshTokens.tokenHash": tokenHash }).select("+refreshTokens");
    if (!user) return res.status(401).json({ message: "Session expired. Please log in again." });
    const token = user.refreshTokens.find((entry) => entry.tokenHash === tokenHash);
    if (!token || token.expiresAt <= new Date()) return res.status(401).json({ message: "Session expired. Please log in again." });
    user.refreshTokens = user.refreshTokens.filter((entry) => entry.tokenHash !== tokenHash);
    return res.json(await issueSession(user, res));
  } catch (error) {
    return next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const refreshToken = readCookie(req, REFRESH_COOKIE);
    if (refreshToken) {
      const tokenHash = hash(refreshToken);
      await User.updateOne({ "refreshTokens.tokenHash": tokenHash }, { $pull: { refreshTokens: { tokenHash } } });
    }
    res.clearCookie(REFRESH_COOKIE, { ...cookieOptions(), maxAge: undefined });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const token = req.query.token;
    if (typeof token !== "string") return res.status(400).json({ message: "A verification token is required." });
    const user = await User.findOne({ emailVerificationTokenHash: hash(token), emailVerificationExpiresAt: { $gt: new Date() } }).select("+emailVerificationTokenHash +emailVerificationExpiresAt");
    if (!user) return res.status(400).json({ message: "Verification link is invalid or expired." });
    user.emailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();
    return res.json({ message: "Email verified successfully." });
  } catch (error) { return next(error); }
}

export async function requestPasswordReset(req, res, next) {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const user = validEmail(email) ? await User.findOne({ email }).select("+passwordResetTokenHash +passwordResetExpiresAt") : null;
    if (user) {
      const token = randomToken();
      user.passwordResetTokenHash = hash(token);
      user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
      sendPasswordResetEmail(user.email, token).catch((error) => console.error("Password reset email failed:", error.message));
    }
    return res.json({ message: "If that account exists, a password reset link has been sent." });
  } catch (error) { return next(error); }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    if (typeof token !== "string" || !validPassword(password)) return res.status(400).json({ message: "Use a valid reset token and a strong password." });
    const user = await User.findOne({ passwordResetTokenHash: hash(token), passwordResetExpiresAt: { $gt: new Date() } }).select("+passwordResetTokenHash +passwordResetExpiresAt +refreshTokens");
    if (!user) return res.status(400).json({ message: "Password reset link is invalid or expired." });
    user.password = password;
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    user.refreshTokens = [];
    await user.save();
    return res.json(await issueSession(user, res));
  } catch (error) { return next(error); }
}
