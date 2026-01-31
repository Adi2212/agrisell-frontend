import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { farmerMenu } from "@/constants/Menus";
import { useNavigate } from "react-router-dom";

import { BarChart3, Package, ShoppingCart, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { productApi } from "@/api/api";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  // Fetch dashboard stats from backend
  const loadStats = async () => {
    try {
      const res = await productApi.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load farmer stats", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (!stats) {
    return (
      <p className="p-6 text-muted-foreground">
        Loading farmer dashboard...
      </p>
    );
  }

  const cards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: ShoppingCart,
    },
    {
      label: "Completed Orders",
      value: stats.completedOrders,
      icon: BarChart3,
    },
  ];

  return (
    <Layout title="Farmer Dashboard" menuItems={farmerMenu}>
      <div className="p-4 space-y-6">

        {/* Greeting */}
        <h2 className="text-2xl font-semibold text-primary">
          Welcome, Farmer
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {cards.map((item, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.label}
                </CardTitle>
                <item.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 p-4 shadow-sm border">
          <h3 className="text-lg font-semibold text-primary mb-3">
            Quick Actions
          </h3>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="bg-primary text-white"
              onClick={() => navigate("/farmer/add-product")}
            >
              <PlusCircle className="mr-2" size={18} />
              Add Product
            </Button>

            <Button
              variant="outline"
              className="bg-primary text-white"
              onClick={() => navigate("/farmer/products")}
            >
              <Package className="mr-2" size={18} />
              My Products
            </Button>

            <Button
              variant="outline"
              className="bg-primary text-white"
              onClick={() => navigate("/farmer/orders")}
            >
              <ShoppingCart className="mr-2" size={18} />
              View Orders
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
