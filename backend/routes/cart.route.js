import express from "express";
import {
  addToCart,
  removeAllFromCart,
  updateQuantity,
  getCartProducts,
} from "../controllers/cart.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, getCartProducts);
router.post("/add", protectedRoute, addToCart);
router.delete("/remove", protectedRoute, removeAllFromCart);
router.put("/update/:id", protectedRoute, updateQuantity);

export default router;
