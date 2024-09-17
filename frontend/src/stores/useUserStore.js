import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      console.log("In store response In Sign up", res.data.user);
      set({ user: res.data.user, loading: false });
      toast.success("Sign up successful!"); // Optional: success message
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during signup.";
      toast.error(errorMessage);
    } finally {
      set({ loading: false }); // Ensure loading is reset after both success and error
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });
      console.log("In store response In Log In", res.data.user);
      set({ user: res.data.user, loading: false });
      toast.success("Login successful!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during signup.";
      toast.error(errorMessage);
      set({ loading: false });
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      console.log(response.data);
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An Error Occured in the Logout"
      );
    }
  },
  refreshToken: async () => {
    if (get().checkingAuth) {
      return;
    }
    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkAuth: false });
    } catch (error) {
      set({ user: null, checkAuth: false });
      throw error;
    }
  },
}));

let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error status is 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If `refreshPromise` exists, wait for it to resolve
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest); // Retry the original request
        }

        // Create the refresh token promise and store it
        refreshPromise = useUserStore.getState().refreshToken();

        // Await the refresh token call and clear `refreshPromise`
        await refreshPromise;
        refreshPromise = null;

        // Retry the original request after the token is refreshed
        return axios(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, log out the user and reject the request
        useUserStore.getState().logout();
        refreshPromise = null; // Clear promise in case of failure
        return Promise.reject(refreshError);
      }
    }

    // If it's not a 401 error, or there's another problem, reject the error
    return Promise.reject(error);
  }
);

