import { redis } from "../lib/redis.js";
import Product from "../models/Product.model.js";

export const getAllProducts = async (req, resp) => {
  try {
    const products = await Product.find();
    return resp.json({ products });
  } catch (error) {
    resp
      .status(500)
      .json({ message: "Error in getAllProducts route", error: error.message });
  }
};

export const getFeaturedProducts = async (req, resp) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return resp.json(JSON.parse(featuredProducts));
    }
    // if not in redis we will fetch it from mongo DB
    featuredProducts = await Product.find({ isFeatured: true }).lean(); // returns js objects instead of moongose objects making the performance faster
    if (!featuredProducts) { 
      resp.status(404).json({ message: "No featured products found" });
    }
    // store in cache for quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    resp.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts", error.message);
    resp.status(500).json({ message: "Server error", error: error.message });
  }
};
