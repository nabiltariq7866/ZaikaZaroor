import express from "express"
import dotenv from "dotenv" 
import connectDB from "./config/db.js";
import router from "./routes/user.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
dotenv.config()
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Aapke frontend ka address
  credentials: true // Cookies (withCredentials) ke liye yeh zaroori hai
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api",router);
app.use("/api",shopRouter);
app.use("/api",itemRouter);
app.listen(process.env.PORT, () => {  
    connectDB()
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
 