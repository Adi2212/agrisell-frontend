import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { authApi } from "@/api/api";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await authApi.post("/login", { email, password });
            const { token, user } = res.data;
            login(user, token);



            if (user.role !== "ADMIN") {
                alert("Access denied! This account is not an admin.");
                setLoading(false);
                return;
            }

            sessionStorage.setItem("token", token);
            sessionStorage.setItem("user", JSON.stringify(user));

            navigate("/admin/dashboard");
        } catch (err) {
            console.error("Admin login failed:", err);
            alert("Invalid admin credentials!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md shadow-xl border border-muted-foreground/10">
                {/* HEADER */}
                <CardHeader className=" text-primary rounded-t-xl ">
                    <div className="flex flex-col items-center text-center space-y-1">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                        <CardTitle className="text-lg font-semibold">
                            Admin Portal Login
                        </CardTitle>
                        <p className="text-xs text-primary">
                            Secure access for administrators only
                        </p>
                    </div>
                </CardHeader>

                {/* BODY */}
                <CardContent className="p-6 space-y-5">
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        {/* Email */}
                        <div>
                            <Label className="text-sm text-primary">Email</Label>
                            <Input
                                type="email"
                                placeholder="admin@agrisell.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <Label className="text-sm text-primary">Password</Label>

                            <div className="relative mt-1">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pr-10"
                                    required
                                />

                                <button
                                    type="button"
                                    className="absolute right-3 inset-y-0 flex items-center justify-center text-muted-foreground hover:text-primary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>


                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-secondary rounded-md py-2 font-medium transition-all"
                            disabled={loading}
                        >
                            {loading ? "Authenticating..." : "Login as Admin"}
                        </Button>
                    </form>

                    {/* Back link */}
                    <div className="text-center mt-2">
                        <Button
                            variant="link"
                            className="text-primary hover:underline text-sm"
                            onClick={() => navigate("/login")}
                        >
                            ← Back to User Login
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
