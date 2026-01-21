import Layout from "../../components/Layout";
import { adminMenu } from "@/constants/menus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, IndianRupee } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Farmers", value: 5, icon: Users },
    { title: "Buyers", value: 5, icon: Users },
    { title: "Products", value: 15, icon: Package },
    { title: "Orders", value: 28, icon: ShoppingCart },
    { title: "Revenue", value: "₹2,54,000", icon: IndianRupee },
  ];

  return (
    <Layout
      title="Admin Dashboard"
      menuItems={adminMenu}
      onLogout={() => {
        sessionStorage.clear();
        window.location.href = "/";
      }}
    >
      {/* Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-sm">{item.title}</CardTitle>
              <item.icon className="text-primary" />
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {item.value}
            </CardContent>
          </Card>
        ))}
      </div>

     

      {/* Overview */}
      <section className="mt-6 text-muted-foreground">
        <h2 className="text-lg font-semibold">Platform Overview</h2>
        <p className="mt-2">
          Manage users, approve farmers, and view analytics here.
        </p>
      </section>
    </Layout>
  );
}
