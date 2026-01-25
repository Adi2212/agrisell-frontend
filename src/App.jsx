import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ThemeToggle from "./components/ThemeToggle";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import AccountDetails from "./pages/AccountDetails";
import EditAccount from "./pages/EditAccount";
import ProductInfo from "./pages/ProductInfo";

import CartPage from "./pages/customers/CartPage";
import Orders from "./pages/customers/Orders";
import OrderDetails from "./pages/customers/OrderDetails";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryPage from "./pages/admin/CategoryPage";

import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerProducts from "./pages/farmer/FarmerProducts";
import AddProduct from "./pages/farmer/AddProduct";
import EditProduct from "./pages/farmer/EditProduct";
import FarmerOrders from "./pages/farmer/FarmersOrders";

import AddAddress from "./pages/AddAddress";



export default function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* ================= PUBLIC ROUTES ================= */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/product/:id" element={<ProductInfo />} />


                    {/* ================= ADMIN ROUTES ================= */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute role="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/categories"
                    element={
                        <ProtectedRoute role="ADMIN">
                            <CategoryPage />
                        </ProtectedRoute>
                    }
                />

                {/* ================= FARMER ROUTES ================= */}
                <Route
                    path="/farmer/dashboard"
                    element={
                        <ProtectedRoute role="FARMER">
                            <FarmerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route 
                    path="/farmer/products"
                    element={
                        <ProtectedRoute role="FARMER">
                            <FarmerProducts />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/farmer/products/add"
                    element={
                        <ProtectedRoute role="FARMER">
                            <AddProduct />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/farmer/products/edit/:id"
                    element={
                        <ProtectedRoute role="FARMER">
                            <EditProduct />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/farmer/orders"
                    element={
                        <ProtectedRoute role="FARMER">
                            <FarmerOrders />
                        </ProtectedRoute>
                    }
                />

                {/* ================= BUYER / USER ROUTES ================= */}
                 <Route
                    path="/buyer/cart"
                    element={
                        <ProtectedRoute role="BUYER">
                            <CartPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/buyer/orders"
                    element={
                        <ProtectedRoute role="BUYER">
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/buyer/orders/:id"
                    element={
                        <ProtectedRoute role="BUYER">
                            <OrderDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/addAddress"
                    element={
                        <ProtectedRoute>
                            <AddAddress />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <AccountDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/account/edit"
                    element={
                        <ProtectedRoute>
                            <EditAccount />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/payment/success"
                    element={
                        <ProtectedRoute>
                            <Success />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/payment/cancel"
                    element={
                        <ProtectedRoute>
                            <Cancel />
                        </ProtectedRoute>
                    }
                />

               
            </Routes>

            {/*GLOBAL THEME TOGGLE */}
            <div className="fixed bottom-4 left-4 z-50">
                <ThemeToggle />
            </div>
        </AuthProvider>
    );
}
