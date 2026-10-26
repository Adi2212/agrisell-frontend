import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/api";
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
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

  // Google Login Hook
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await authApi.post("/oauth/google", { token: tokenResponse.access_token });
        const { token, user } = res.data;

        login(user, token);
        toast.success(`Welcome back, ${user.name}!`);

        if (user.role === "ADMIN") return navigate("/admin/dashboard");
        if (!user.address) return navigate("/addAddress");
        if (user.role === "BUYER") return navigate("/");
        if (user.role === "FARMER") return navigate("/farmer/dashboard");

        navigate("/");
      } catch (err) {
        toast.error("Google Login failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Google Login failed")
  });



  // Facebook Login Handler
  const handleFacebookSuccess = async (response) => {
    setLoading(true);
    try {
      const res = await authApi.post("/oauth/facebook", { token: response.accessToken });
      const { token, user } = res.data;

      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === "ADMIN") return navigate("/admin/dashboard");
      if (!user.address) return navigate("/addAddress");
      if (user.role === "BUYER") return navigate("/");
      if (user.role === "FARMER") return navigate("/farmer/dashboard");

      navigate("/");
    } catch (err) {
      toast.error("Facebook Login failed.");
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

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => loginWithGoogle()}
                className="w-full flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
              
              <FacebookLogin
                appId={import.meta.env.VITE_FACEBOOK_APP_ID || "default-app-id"}
                onSuccess={handleFacebookSuccess}
                onFail={() => toast.error("Facebook Login failed")}
                onProfileSuccess={() => {}}
                render={({ onClick }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClick}
                    className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white hover:bg-[#166FE5]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                  </Button>
                )}
              />
            </div>
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
