import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { adminMenu } from "@/constants/menus";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, IndianRupee } from "lucide-react";

import OrdersStatusAreaChart from "@/components/OrdersStatusAreaChart";
import { adminApi } from "@/api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  // Fetch stats from backend
  const loadStats = async () => {
    try {
      const res = await adminApi.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Loading state
  if (!stats) {
    return <p className="p-6 text-muted-foreground">Loading dashboard...</p>;
  }

  // Dynamic cards
  const cards = [
    { title: "Farmers", value: stats.farmers, icon: Users },
    { title: "Buyers", value: stats.buyers, icon: Users },
    { title: "Products", value: stats.products, icon: Package },
    { title: "Orders", value: stats.orders, icon: ShoppingCart },
    {
      title: "Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: IndianRupee,
    },
  ];

  return (
    <Layout title="Admin Dashboard" menuItems={adminMenu}>
      {/* Stats Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {cards.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-sm">{item.title}</CardTitle>
              <item.icon size={20} className="text-primary" />
            </CardHeader>

            <CardContent className="text-2xl font-semibold">
              {item.value}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders Chart */}
      <OrdersStatusAreaChart />

      
    </Layout>
  );
}
