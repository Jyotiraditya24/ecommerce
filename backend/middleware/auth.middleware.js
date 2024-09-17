import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protectedRoute = async (req, resp, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return resp.status(401).json({ message: "Unauthorized" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findOne({ _id: decoded.userId }).select("-password");
      if (!user) {
        return resp.status(401).json({ message: "User not found " });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return resp.status(401).json({ message: "Token Expired" });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protected route middleware", error.message);
    resp.status(401).json({ message: "Unauthorized" });
  }
};

export const adminRoute = async (req, resp, next) => {
  try {
    const user = req.user;
    if (user && user.role === "admin") {
      next();
    } else {
      return resp.status(401).json({ message: "Unauthorized Admin only" });
    }
  } catch (error) {
    console.log("Error in admin Route", error.message);
    resp.status(401).json({ message: "Unauthorized Admin only" });
  }
};
