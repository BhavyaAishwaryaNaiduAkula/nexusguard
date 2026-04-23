const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// --- Debug Logging Middleware ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

// --- API Routes ---

/**
 * Open Login API:
 * Per requirements, allows all email/password combinations.
 * Always returns successful administrative access.
 */
app.post("/api/login", (req, res) => {
  const { email } = req.body;
  console.log(`-> Login attempt: ${email} | Result: AUTO-AUTHORIZED`);

  return res.status(200).json({ 
    message: "Login successful",
    email: email,
    role: "admin"
  });
});

app.post("/api/analyze", (req, res) => {
  res.status(200).json({
    error: "Memory Leak Detected",
    type: "Performance",
    severity: "Medium",
    root_cause: "Unclosed database connections in session-handler",
    fix: "Implement connection pooling or ensure client.close() is called",
    explanation: "Memory usage is slowly increasing over time.",
    confidence: "88%",
    pr_message: "perf: fix memory leak in session management"
  });
});

// --- Server Startup ---
const server = app.listen(port, () => {
  console.log(`\n===========================================`);
  console.log(`NEXUSGUARD BACKEND INITIALIZED`);
  console.log(`Endpoint: http://localhost:${port}`);
  console.log(`Status: OPEN ACCESS ENABLED`);
  console.log(`===========================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[FATAL ERROR] Port ${port} is already in use.`);
  }
  process.exit(1);
});
