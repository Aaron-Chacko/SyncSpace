import express from "express";
import cors from "cors";

const app = express();

/* -------------------- Middlewares -------------------- */

// Allow requests from the frontend
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

/* -------------------- Health Check Route -------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 SyncSpace Backend is running",
  });
});

/* -------------------- Export App -------------------- */

export default app;