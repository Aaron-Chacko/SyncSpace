import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

/* -------------------- Middlewares -------------------- */

const allowedOrigins = process.env.CLIENT_ORIGIN?.split(",") ?? ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins }));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/sessions", sessionRoutes);

/* -------------------- Health Check Route -------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 SyncSpace Backend is running",
  });
});

app.use((req, res) => res.status(404).json({ message: "Route not found." }));
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.name === "ValidationError" ? 400 : 500;
  res.status(status).json({ message: status === 500 ? "Internal server error." : error.message });
});

/* -------------------- Export App -------------------- */

export default app;
