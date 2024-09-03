import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

// to read the dotenv file
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("server is running on http://localhost:" + PORT);
});
