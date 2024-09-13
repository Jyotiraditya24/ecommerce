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
}));
