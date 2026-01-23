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

// Automatically attach JWT token to all requests made with productApi,userApi,categoryApi
const apis = [productApi, userApi, categoryApi];

apis.forEach((api) => {
  api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    return config;
  });
});

