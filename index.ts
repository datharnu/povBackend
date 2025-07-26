/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Middlewares
import errorHandlerMiddleware from "./middlewares/errorHandler";

// Routers
import authRouter from "./routes/auth";

const PORT = process.env.PORT || 5000;
const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to PXF Restructure with TypeScript by Odunayo API",
    docs: "/api-docs",
    status: "Server is running successfully",
  });
});

console.log("Mounting /api/v1/auth route");

// API Routes
app.use("/api/v1/auth", authRouter);

// 404 handler for undefined routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found`) as any;
  error.statusCode = 404;
  next(error);
});

// Error handling middleware (must be last)
app.use(errorHandlerMiddleware);

// Global error handlers
process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
