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
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ✅ CORS fix (https:// lagaya production domain me)
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://aiinterviewnavneet-fdh0gqb6dkgkdyb6.westindia-01.azurewebsites.net"]
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

// ✅ API 404 handler (React routes se pehle rakha)
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// ✅ React build serve
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is live at http://localhost:${PORT} (Azure will map this automatically)`);
});
