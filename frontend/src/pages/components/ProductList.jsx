import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../../stores/useProductStore";

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="">
        {products?.map((product) => (
          <div
            key={product._id}
            className="flex flex-col sm:flex-row items-center justify-between p-4 hover:bg-gray-700"
          >
            {/* Product Image and Info */}
            <div className="flex items-center space-x-4">
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={product.image}
                alt={product.name}
              />
              <div>
                <h2 className="text-white text-sm font-medium">
                  {product.name}
                </h2>
                <p className="text-gray-300 text-sm">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-gray-400 text-xs">{product.category}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {/* Featured Button */}
              <button
                onClick={() => toggleFeaturedProduct(product._id)}
                className={`p-2 rounded-full ${
                  product.isFeatured
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-600 text-gray-300"
                } hover:bg-yellow-500 transition-colors duration-200`}
              >
                <Star className="h-5 w-5" />
              </button>

              {/* Delete Button */}
              <button
                onClick={() => deleteProduct(product._id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductsList;
