import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cookieParser from "cookie-parser";
import { connectDb } from "./lib/db.js";
import cors from "cors";

// to read the dotenv file
dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

app.listen(PORT, () => {
  console.log("server is running on http://localhost:" + PORT);
  connectDb();
});
