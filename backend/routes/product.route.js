import express from "express";
import { getAllProducts,getFeaturedProducts } from "../controllers/product.controller.js";
import { protectedRoute,adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts);

router.get("/",getFeaturedProducts);

export default router;
