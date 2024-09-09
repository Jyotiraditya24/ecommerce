import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getCatergoryProducts,
  getRecommendedProduct,
  toggleFeature,
} from "../controllers/product.controller.js";
import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recommendation", getRecommendedProduct);
router.get("/category/:category", getCatergoryProducts);
router.post("/create", protectedRoute, adminRoute, createProduct);
router.post("/delete/:id", protectedRoute, adminRoute, deleteProduct);
router.patch("/update/:id", protectedRoute, adminRoute,toggleFeature); // patch for a couple of fields but for whole document use put

export default router;
