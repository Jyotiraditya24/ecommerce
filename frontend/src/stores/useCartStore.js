import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [{ product: {}, quantity: 0 }],
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,
  getCartItems: async () => {
    try {
      const response = await axios.get("/cart");
      set({ cart: response.data.cart });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      //   toast.error("An error occured in Cart");
    }
    get().calculateTotals();
  },
  addToCart: async (product) => {
    console.log(product);
    console.log(get().cart);
    try {
      const response = await axios.post(`/cart/add`, {
        productId: product._id,
      });
      toast.success("Added to cart");
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item?.product?._id === product?._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item.product?._id === product?._id
                ? { ...item, quantity: item?.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      toast.error(error.response?.data?.message || "An error occured");
    }
    get().calculateTotals();
  },
  calculateTotals: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce(
      (sum, item) => sum + item.quantity * item.product?.price,
      0
    );
    let total = subTotal;
    if (coupon) {
      const discount = subTotal * (coupon.discount / 100);
      total = subTotal - discount;
    }
    set({ subTotal, total });
  },
  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    await axios.put(`/cart/update/${productId}`, { quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      ),
    }));
    get().calculateTotals();
  },
  removeFromCart: async (productId) => {
    await axios.delete(`/cart/remove`, { productId: productId });
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item.product._id !== productId),
    }));
    get().calculateTotals();
  },
  clearCart: () => {
    set({ cart: [], total: 0, subTotal: 0, coupon: null });
  },
}));
