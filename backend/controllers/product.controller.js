import Product from "../models/Product.model";

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
