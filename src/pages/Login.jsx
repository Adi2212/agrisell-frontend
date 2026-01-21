import { Eye, EyeOff } from "lucide-react";
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
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth(); //   use custom hook
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authApi.post("/login", { email, password });
      const { token, user } = res.data;

      //   Save auth
      login(user, token);

      toast.success(`Welcome back, ${user.name}!`);

      //   ADMIN → dashboard
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
        return;
      }

      //   BUYER / FARMER without address → address check
      if (!user.address) {
        navigate("/addAddress");
        return;
      }

      //   BUYER with address
      if (user.role === "BUYER") {
        navigate("/");
        return;
      }

      //   FARMER with address
      if (user.role === "FARMER") {
        navigate("/farmer/dashboard");
        return;
      }

      //   fallback
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border border-muted-foreground/10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-primary">
            Login to AgriSell
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Password</Label>

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
                  className="absolute right-3 inset-y-0 flex items-center justify-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>


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

      {/* Admin Login Button */}
      <Button
        onClick={() => navigate("/admin/login")}
        variant="outline"
        className="fixed bottom-6 right-6 bg-background border border-primary text-primary shadow-md"
      >
        Admin Login
      </Button>
    </div>
  );
}