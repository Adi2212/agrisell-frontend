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

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryPage from "./pages/admin/CategoryPage";

import FarmerDashboard from "./pages/farmer/FarmerDashboard";

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

                {/* ================= BUYER / USER ROUTES ================= */}
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

            </Routes>

            {/*GLOBAL THEME TOGGLE */}
            <div className="fixed bottom-4 left-4 z-50">
                <ThemeToggle />
            </div>
        </AuthProvider>
    );
}
