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
  console.log("-> Root route hit. Sending confirmation.");
  res.send("Backend is working ✅");
});

// --- API Routes ---

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  console.log(`-> Login attempt: ${email}`);

  try {
    if (email === "admin@gmail.com" && password === "1234") {
      console.log("   Status: Success");
      return res.status(200).json({ 
        message: "Login successful",
        user: { id: "1", name: "Admin", email: "admin@gmail.com", role: "admin" }
      });
    }
    console.log("   Status: Unauthorized");
    res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("   Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/analyze", (req, res) => {
  console.log("-> Analysis request received");
  try {
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
  } catch (error) {
    console.error("   Analysis Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- Server Startup & Heartbeat ---

const server = app.listen(port, () => {
  console.log(`\n===========================================`);
  console.log(`NEXUSGUARD BACKEND INITIALIZED`);
  console.log(`Endpoint: http://localhost:${port}`);
  console.log(`Status: LISTENING`);
  console.log(`===========================================\n`);
  
  // Keep-alive heartbeat every 60 seconds
  setInterval(() => {
    console.log(`[Heartbeat] Server is still alive at ${new Date().toLocaleTimeString()}`);
  }, 60000);
});

// Explicit error handling for the server itself (e.g. Port already in use)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[FATAL ERROR] Port ${port} is already in use.`);
    console.error(`Please kill the process using port ${port} or choose a different port.\n`);
  } else {
    console.error(`\n[FATAL ERROR] Server failed to start:`, err);
  }
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log("\nShutting down server...");
  server.close(() => {
    console.log("Server closed. Goodbye!\n");
    process.exit(0);
  });
});
