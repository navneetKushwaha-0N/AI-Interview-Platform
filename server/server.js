import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import interviewRoutes from "./routes/interview.js";
import progressRoutes from "./routes/progress.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ES Module ke liye dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["aiinterviewnavneet-fdh0gqb6dkgkdyb6.westindia-01.azurewebsites.net"] // 👈 Azure frontend domain
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes (API)
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/progress", progressRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "AI Interview Platform API is running!" });
});

// ✅ Serve React build (client/dist moved into server/public)
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler (API ke liye)
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
