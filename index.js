import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSatinizer from "express-mongo-sanitize";
dotenv.config();

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
app.use("/api",limiter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

//Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(err.stack||500).json({
    status: "error",
    message: err.message || "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});
  
//API routes


//log middlerware
if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}

//Body Parser middlerware
app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));


//it should be always at bottom
//404 handler

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});


console.log(process.env.PORT);