import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/api";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "BUYER", // default
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
      };

      
      await authApi.post("/register", payload);

      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border border-muted-foreground/10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-primary">
            User Registration
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center text-muted-foreground hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center text-muted-foreground hover:text-primary"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            {/* Role */}
            <div className="space-y-1">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm({ ...form, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUYER">Buyer</SelectItem>
                  <SelectItem value="FARMER">Farmer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-secondary hover:bg-primary/90"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center pb-4 flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-primary hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
