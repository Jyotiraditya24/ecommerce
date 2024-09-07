import cloudinary from "../lib/cloudinary.js";
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

export const createProduct = async (req, resp) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url,
      category,
    });

    resp.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct", error.message);
    resp.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = (req, resp) => {
  try {
    const { id: productId } = req.params;
    const product = Product.findById(productId);
    if (!product) {
      resp.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted");
      } catch (error) {
        console.log("Error deleting image from cloudinary");
      }
    }
    
  } catch (error) {}
};
