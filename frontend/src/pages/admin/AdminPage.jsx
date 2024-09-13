import React, { useState } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import CreateProduct from "./CreateProduct";
import ProductList from "../components/ProductList";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");

  const { createProduct } = useProductStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const tabs = [
    { id: "create", label: "Create Product", icon: PlusCircle },
    { id: "products", label: "Products", icon: ShoppingBasket },
    { id: "analytics", label: "Analytics", icon: BarChart },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full items-center max-w-6xl mx-auto gap-y-4">
      {/* navigation */}
      <div className="w-full flex flex-row justify-between max-w-xl py-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === tab.id
                ? "bg-emerald-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <tab.icon></tab.icon>
            <p>{tab.label}</p>
          </button>
        ))}
      </div>

      {activeTab === "create" && <CreateProduct />}
      {activeTab === "products" && <ProductList />}
    </div>
  );
};

export default AdminPage;
