import React from "react";
import {  Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";


import ThemeToggle from "./components/ThemeToggle";


import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";



export default function App() {
    return (   
            <AuthProvider>
                <Routes>
                    {/* ================= PUBLIC ROUTES ================= */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>

                {/*GLOBAL THEME TOGGLE */}
                <div className="fixed bottom-4 left-4 z-50">
                    <ThemeToggle />
                </div>
            </AuthProvider>
    );
}
