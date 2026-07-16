import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

//login middlerware
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