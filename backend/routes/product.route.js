import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recommendation", getRecommendedProduct);
router.post("/create", protectedRoute, adminRoute, createProduct);
router.post("/delete/:id", protectedRoute, adminRoute, deleteProduct);

export default router;
