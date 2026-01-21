import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "@/api/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function AddAddress() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    district: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const token = sessionStorage.getItem("token");
      if (!user) {
        alert("User not logged in!");
        navigate("/login");
        return;
      }

      //call backend (Spring Boot API)
      const res = await userApi.put(`/user/address`, form,{
        headers: { Authorization: `Bearer ${token}` },
      });

      //update sessionStorage user (optional)
      sessionStorage.setItem("user", JSON.stringify(res.data));

      toast.success("Address added successfully");
      if(user.role === "FARMER") navigate("/farmer/dashboard");
      else
      navigate("/");
    } catch (err) {
      console.error("Error adding address:", err);
      const msg =
        err.response?.data?.message || "Failed to save address. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border border-muted-foreground/10">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold text-primary">
            Add Delivery Address
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label>Street</Label>
              <Input
                name="street"
                value={form.street}
                onChange={handleChange}
                placeholder="Enter street address"
                required
              />
            </div>

            <div>
              <Label>City</Label>
              <Input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>

            <div>
              <Label>District</Label>
              <Input
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="Enter district"
                required
              />
            </div>

            <div>
              <Label>State</Label>
              <Input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
            </div>

            <div>
              <Label>Postal Code</Label>
              <Input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
                required
              />
            </div>

            <div>
              <Label>Country</Label>
              <Input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Enter country"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Address"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
