import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [openForgot, setOpenForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // Reset Password State
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authApi.post("/login", { email, password });
      const { token, user } = res.data;

      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === "ADMIN") return navigate("/admin/dashboard");
      if (!user.address) return navigate("/addAddress");
      if (user.role === "BUYER") return navigate("/");
      if (user.role === "FARMER") return navigate("/farmer/dashboard");

      navigate("/");
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Request
  const handleForgotPassword = async () => {
    if (!forgotEmail) return toast.error("Please enter email");

    try {
      await authApi.post("/forgot-password", { email: forgotEmail });
      toast.success("OTP sent to your email ✅");
    } catch (err) {
      toast.error("Failed to send OTP. Try again.");
    }
  };

  // Reset Password Request
  const handleResetPassword = async () => {
    if (!otp || !newPassword)
      return toast.error("OTP and New Password required");

    setResetLoading(true);

    try {
      await authApi.post("/reset-password", {
        token: otp,
        newPassword: newPassword,
      });

      toast.success("Password reset successful ✅");

      // Close Modal + Clear Fields
      setOpenForgot(false);
      setOtp("");
      setNewPassword("");
      setForgotEmail("");
    } catch (err) {
      toast.error("Invalid OTP or OTP expired");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline text-sm">Back</span>
      </button>

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-xl border border-muted-foreground/10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-primary">
            Login to AgriSell
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label>Password</Label>

              <div className="relative">
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
                  className="absolute right-3 inset-y-0 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <button
                type="button"
                onClick={() => setOpenForgot(true)}
                className="text-sm text-primary hover:underline mt-2"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-secondary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center text-sm text-muted-foreground">
          Don&apos;t have an account?
          <button
            onClick={() => navigate("/register")}
            className="text-primary hover:underline"
          >
            Sign Up
          </button>
        </CardFooter>
      </Card>

      {/* Admin Login */}
      <Button
        onClick={() => navigate("/admin/login")}
        variant="outline"
        className="fixed bottom-6 right-6 bg-background border border-primary text-primary shadow-md"
      >
        Admin Login
      </Button>

      {/* Forgot Password Modal */}
      <Dialog open={openForgot} onOpenChange={setOpenForgot}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>

          {/* Email Input */}
          <div className="space-y-2">
            <Label>Enter Registered Email</Label>
            <Input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter email"
            />

            <Button className="w-full" onClick={handleForgotPassword}>
              Send OTP
            </Button>
          </div>

          {/* OTP + New Password */}
          <div className="space-y-2 mt-4">
            <Label>Enter OTP</Label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
            />

            <Label>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleResetPassword}
              disabled={resetLoading}
            >
              {resetLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
