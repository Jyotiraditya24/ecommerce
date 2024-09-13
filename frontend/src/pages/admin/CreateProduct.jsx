import React from "react";
import { useState } from "react";
import { useProductStore } from "../../stores/useProductStore";

const CreateProduct = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const { createProduct } = useProductStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file); // convert to base64 string representation
    }
  };

   const handleChange = (e) => {
     const { name, value } = e.target;
     setNewProduct({ ...newProduct, [name]: value });
   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    } catch (error) {
      console.log("Error in createProduct", error.message);
    }
  };
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-700">
          Create New Product
        </h1>
      </div>

      {/* Form Section */}
      <form className="mt-6" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
            placeholder="Enter product name"
          />
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
            placeholder="Enter product description"
            rows="4"
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
            placeholder="Enter price"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Category
          </label>
          <select
            name="category"
            value={newProduct.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          >
            <option value="">Select category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Furniture">Furniture</option>
            {/* Add more categories here */}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Upload Product Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="reset"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 focus:ring focus:ring-red-200"
            onClick={() =>
              setNewProduct({
                name: "",
                description: "",
                price: "",
                category: "",
                image: "",
              })
            }
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 focus:ring focus:ring-blue-200"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
