import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user"
import pollRoutes from "./routes/polls"
import voteRoutes from "./routes/vote"
import settingsRoutes from "./routes/settings"

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/polls", pollRoutes)
app.use("/api/polls", voteRoutes) // voting routes under polls
app.use("/api/settings", settingsRoutes)


// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/evote";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });
