import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products: products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/product/create", productData);
      set((state) => ({
        products: [...state.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/product");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      toast.error(error.response.data.message);
      set({ loading: false });
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true });
    await axios.post(`/product/delete/${productId}`);
    set((state) => ({
      products: state.products.filter((product) => product._id !== productId),
    }));
  },
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/product/update/${productId}`);
      console.log(response.data.updatedProduct);
      set((state) => ({
        products: state.products.map((product) => {
          if (response.data.updatedProduct._id === product._id) {
            product = response.data.updatedProduct;
          }
          return product;
        }),
        loading: false,
      }));
    } catch (error) {}
  },
}));
