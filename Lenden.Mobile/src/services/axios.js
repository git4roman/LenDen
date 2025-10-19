import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { store } from "@/src/store/store";
import { logout } from "@/src/store/userSlice";
import { router } from "expo-router";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("userToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("userToken");
      store.dispatch(logout());
      router.replace("/(auth)");
      return Promise.reject("Session expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
