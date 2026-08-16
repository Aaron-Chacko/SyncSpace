import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authMiddleware from "./middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_DIR = path.join(__dirname, "temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

/* -------------------- Middlewares -------------------- */

const allowedOrigins = process.env.CLIENT_ORIGIN?.split(",") ?? ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// DB Readiness Check Middleware for API routes (except /api/execute)
app.use("/api", (req, res, next) => {
  if (req.path === "/execute") return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database Unavailable: MongoDB is not connected on the server. Please start your local MongoDB service or update MONGO_URI in server/.env",
    });
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/admin", adminRoutes);

/* -------------------- Health Check Route -------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 SyncSpace Backend is running",
  });
});

/* -------------------- Local Code Runner Logic -------------------- */

function runCommand(cmd, args, stdin, timeout = 3000) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let killed = false;

    // On Windows, running batch commands (like npx, npm) requires shell: true
    const isWindows = process.platform === 'win32';
    const useShell = isWindows && (cmd === 'npx' || cmd === 'npm');

    const child = spawn(cmd, args, { shell: useShell });

    const timer = setTimeout(() => {
      killed = true;
      child.kill('SIGKILL');
    }, timeout);

    if (stdin) {
      child.stdin.write(stdin);
      child.stdin.end();
    }

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        code: -1,
        stdout,
        stderr: stderr + `ENOENT: ${err.message}`
      });
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      if (killed) {
        resolve({
          code: -2,
          stdout,
          stderr: stderr + '\nExecution Error: Time Limit Exceeded (3s)'
        });
      } else {
        resolve({ code, stdout, stderr });
      }
    });
  });
}

async function executeLocalCode(language, code, stdin) {
  const timestamp = Date.now() + Math.random().toString(36).substring(2, 6);
  
  const extensions = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    go: 'go',
    rust: 'rs',
    ruby: 'rb',
    php: 'php'
  };

  const ext = extensions[language];
  if (!ext) {
    return { code: -1, stdout: '', stderr: `Unsupported language: ${language}` };
  }

  const filename = `code_${timestamp}.${ext}`;
  const filepath = path.join(TEMP_DIR, filename);
  fs.writeFileSync(filepath, code);

  let result;

  try {
    if (language === 'javascript') {
      result = await runCommand('node', [filepath], stdin);
    } else if (language === 'python') {
      result = await runCommand('python', [filepath], stdin);
      if (result.stderr && result.stderr.includes('ENOENT')) {
        result = await runCommand('python3', [filepath], stdin);
      }
      if (result.stderr && result.stderr.includes('ENOENT')) {
        result = await runCommand('py', [filepath], stdin);
      }
    } else if (language === 'java') {
      result = await runCommand('java', [filepath], stdin);
    } else if (language === 'go') {
      result = await runCommand('go', ['run', filepath], stdin);
    } else if (language === 'ruby') {
      result = await runCommand('ruby', [filepath], stdin);
    } else if (language === 'php') {
      result = await runCommand('php', [filepath], stdin);
    } else if (language === 'typescript') {
      result = await runCommand('npx', ['ts-node', filepath], stdin);
    } else if (language === 'cpp') {
      const outpath = path.join(TEMP_DIR, `code_${timestamp}.exe`);
      const compile = await runCommand('g++', [filepath, '-o', outpath], '');
      if (compile.code !== 0) {
        result = { code: compile.code, stdout: '', stderr: 'Compilation Error:\n' + compile.stderr };
      } else {
        result = await runCommand(outpath, [], stdin);
        try { fs.unlinkSync(outpath); } catch (e) {}
      }
    } else if (language === 'c') {
      const outpath = path.join(TEMP_DIR, `code_${timestamp}.exe`);
      const compile = await runCommand('gcc', [filepath, '-o', outpath], '');
      if (compile.code !== 0) {
        result = { code: compile.code, stdout: '', stderr: 'Compilation Error:\n' + compile.stderr };
      } else {
        result = await runCommand(outpath, [], stdin);
        try { fs.unlinkSync(outpath); } catch (e) {}
      }
    } else if (language === 'rust') {
      const outpath = path.join(TEMP_DIR, `code_${timestamp}.exe`);
      const compile = await runCommand('rustc', [filepath, '-o', outpath], '');
      if (compile.code !== 0) {
        result = { code: compile.code, stdout: '', stderr: 'Compilation Error:\n' + compile.stderr };
      } else {
        result = await runCommand(outpath, [], stdin);
        try { fs.unlinkSync(outpath); } catch (e) {}
      }
    }
  } catch (err) {
    result = { code: -1, stdout: '', stderr: err.message };
  } finally {
    try { fs.unlinkSync(filepath); } catch (e) {}
  }

  // Format nice missing command error (ENOENT)
  if (result && result.stderr && result.stderr.includes('ENOENT')) {
    result.stderr = `Local runner error: '${language}' runtime or compiler not found on this machine.\nPlease ensure it is installed and configured in your system PATH environment.`;
  }

  return result;
}

/* -------------------- Code Execution Route -------------------- */

  app.post("/api/execute", authMiddleware, async (req, res) => {
  const { language, code, stdin = "" } = req.body;

  const supportedLanguages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "c",
    "go",
    "rust",
    "ruby",
    "php",
  ];

  if (!language || !supportedLanguages.includes(language)) {
    return res.status(400).json({
      error: "Unsupported or missing programming language",
    });
  }

  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({
      error: "Code is required",
    });
  }

  if (typeof stdin !== "string") {
    return res.status(400).json({
      error: "Input must be a string",
    });
  }

  try {
    const startTime = process.hrtime();
    const result = await executeLocalCode(language, code, stdin);
    const diff = process.hrtime(startTime);
    const timeTaken = (diff[0] + diff[1] / 1e9).toFixed(3);

    return res.json({
      run: {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        code: result.code,
        time: timeTaken
      }
    });
  } catch (error) {
    console.error("Code execution error:", error);
    return res.status(500).json({ error: "Failed to execute code locally" });
  }
});
app.use((req, res) => res.status(404).json({ message: "Route not found." }));
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.name === "ValidationError" ? 400 : 500;
  res.status(status).json({ message: status === 500 ? "Internal server error." : error.message });
});

/* -------------------- Export App -------------------- */

export default app;
