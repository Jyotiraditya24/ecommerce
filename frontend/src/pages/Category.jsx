import React, { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";

const Category = () => {
  const { fetchProductsByCategory, products } = useProductStore();
  const { category } = useParams();
  useEffect(() => {
    fetchProductsByCategory(category);
  }, [category]);

  console.log(products);
  return (
    <div>
      <h1>Hi</h1>
    </div>
  );
};

export default Category;
