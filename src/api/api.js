import axios from "axios";

/* Base URL Variable */
const BASE_URL = import.meta.env.VITE_BASE_URL;

console.log("Base URL:", BASE_URL);
/* Auth API (separate path) */
export const authApi = axios.create({
  baseURL: `${BASE_URL}/auth`,
  headers: { "Content-Type": "application/json" },
});

/* User API */
export const userApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* Product API */
export const productApi = axios.create({
  baseURL: `${BASE_URL}/products`,
  headers: { "Content-Type": "application/json" },
});

/* Category API */
export const categoryApi = axios.create({
  baseURL: `${BASE_URL}/categories`,
});

/* Order API */
export const orderApi = axios.create({
  baseURL: `${BASE_URL}/orders`,
  headers: { "Content-Type": "application/json" },
});

/* ImageKit API */
export const imagekitApi = axios.create({
  baseURL: `${BASE_URL}/imagekit`,
});

/* Payment API */
export const paymentApi = axios.create({
  baseURL: `${BASE_URL}/payments`,
  headers: { "Content-Type": "application/json" },
});

/* Admin API */
export const adminApi = axios.create({
  baseURL: `${BASE_URL}/admin`,
  headers: { "Content-Type": "application/json" },
});

/* Review API */
export const reviewApi = axios.create({
  baseURL: `${BASE_URL}/reviews`,
  headers: { "Content-Type": "application/json" },
});

/* Attach JWT Token Interceptor */
const apis = [
  productApi,
  userApi,
  categoryApi,
  orderApi,
  imagekitApi,
  paymentApi,
  adminApi,
  reviewApi,
];

apis.forEach((api) => {
  api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
});
