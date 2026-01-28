import axios from "axios";

const token = sessionStorage.getItem("token");


export const authApi = axios.create({
  baseURL: "http://localhost:9090/auth",
  headers: { "Content-Type": "application/json" },
});

export const userApi = axios.create({
  baseURL: "http://localhost:9090",
  headers: { "Content-Type": "application/json" },
});

export const productApi = axios.create({
  baseURL: "http://localhost:9090/products",
  headers: { "Content-Type": "application/json" },
});

export const categoryApi = axios.create({
  baseURL: "http://localhost:9090/categories",
});

export const orderApi = axios.create({
  baseURL: "http://localhost:9090/orders",
  headers: { "Content-Type": "application/json" },
});

export const imagekitApi = axios.create({
  baseURL: "http://localhost:9090/imagekit",
});

export const paymentApi = axios.create({
  baseURL: "http://localhost:9090/payments",
  headers: { "Content-Type": "application/json" },
});

export const adminApi = axios.create({
  baseURL: "http://localhost:9090/admin",
  headers: { "Content-Type": "application/json" },
});

export const reviewApi = axios.create({
  baseURL: "http://localhost:9090/reviews",
  headers: { "Content-Type": "application/json" },
});

// Automatically attach JWT token to all requests made with productApi,userApi,categoryApi, orderApi,imagekitApi, paymentApi, adminApi, reviewApi
const apis = [productApi, userApi, categoryApi, orderApi, imagekitApi, paymentApi, adminApi, reviewApi];
apis.forEach((api) => {
  api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    return config;
  });
});

