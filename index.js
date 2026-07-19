import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSatinize from "express-mongo-sanitize";
import cors from "cors";
import hpp from "hpp";
import cookieParser from "cookie-parser";

import healthRoute from './routes/health.routes.js'
dotenv.config();
import userRoute from "./routes/user.routes.js"

const app = express();
const PORT = process.env.PORT || 5000;

//Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

//security middleware
app.use(helmet());
app.use(mongoSatinize());
app.use(hpp());
app.use("/api", limiter);

// Log middleware
if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}

// Body parser middleware
app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

//CORSconfuguration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods:["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS","HEAD"],
  allowedHeaders: [
    "Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "Access-Control-Allow-Origin","device-remember-token"],
}))

// API routes 
app.use("/api/v1/healthcheck", healthRoute);
app.use("/api/v1/user",userRoute);

//it should be always at bottom
//404 handler

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  const candidateStatus = err.statusCode || err.status;
  const statusCode = Number.isInteger(candidateStatus) && candidateStatus >= 400 && candidateStatus < 600
    ? candidateStatus
    : 500;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}
