import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDb.js";
import authRouter from "./routes/authRoutes.js";


// env config
dotenv.config();

// Express instance
const app = express();

// DB Connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", authRouter);

// Port
const PORT = process.env.PORT;

// Listen Port 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});