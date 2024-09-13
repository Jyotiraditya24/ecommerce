import React from "react";
import { useProductStore } from "../../stores/useProductStore";
import { Trash, Star } from "lucide-react";

const ProductList = () => {
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();
  return <div>ProductList</div>;
};

export default ProductList;
