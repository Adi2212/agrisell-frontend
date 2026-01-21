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
