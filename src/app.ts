import express from "express";
// import https from "https";
import serverless from "serverless-http";

import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";

import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";
import { authMiddleware } from "./middlewares/auth";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
});

// Paths to your SSL certificate and private key
// const sslOptions = {
//   key: fs.readFileSync(path.join(__dirname, "../certs/techNS27_public.key")),
//   cert: fs.readFileSync(path.join(__dirname, "../certs/techNS27.crt")),
// };

// try {
//   const key = fs.readFileSync(sslOptions.key, "utf8");
//   const cert = fs.readFileSync(sslOptions.cert, "utf8");
//   console.log("Key and certificate read successfully.");
// } catch (error) {
//   console.error("Error reading key or certificate:", error);
// }
// Middleware
app.use(express.json());
app.use(cors());
// Apply the rate limiter to all requests
app.use(limiter);

// const httpsServer = https.createServer(sslOptions, app);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/taskdb")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Create an HTTPS server
// const PORT = 5000;
// httpsServer.listen(PORT, () => {
//   console.log(`Server is running on https://localhost:${PORT}`);
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// export const handler = serverless(app);
