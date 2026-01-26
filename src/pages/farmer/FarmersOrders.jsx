import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { farmerMenu } from "@/constants/menus";
import { orderApi } from "@/api/api";
import { useNavigate } from "react-router-dom";

import StatusBadge from "@/components/StatusBadge";
import PaymentBadge from "@/components/PaymentBadge";

import { Card } from "@/components/ui/card";

export default function FarmerOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Farmer Orders
  useEffect(() => {
    fetchFarmerOrders();
  }, []);

  const fetchFarmerOrders = async () => {
    try {
      setLoading(true);

      const res = await orderApi.get("/farmer");
      setOrders(res.data);

    } catch (err) {
      console.error("Failed to load farmer orders:", err);
      alert("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Farmer Orders" menuItems={farmerMenu}>
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <h2 className="text-2xl font-bold text-primary">
          Orders Received
        </h2>

        {/* Loading */}
        {loading && (
          <p className="text-muted-foreground">
            Loading orders...
          </p>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <p className="text-muted-foreground">
            No orders received yet.
          </p>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((o) => (
            <Card
              key={o.orderId}
              // onClick={() => navigate(`/farmer/orders/${o.orderId}`)}
              className="p-5 cursor-pointer hover:shadow-md transition border rounded-xl"
            >
              {/* Top Row */}
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  Order ID:{" "}
                  <span className="font-semibold">{o.orderId}</span>
                </p>

                <p className="text-sm text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Amount */}
              <p className="mt-2 text-lg">
                Total: <b>₹{o.totalAmount}</b>
              </p>

              {/* Status Badges */}
              <div className="flex gap-2 mt-3">
                <StatusBadge status={o.status} />
                <PaymentBadge status={o.paymentStatus} />
              </div>

              {/* Items Preview */}
              <div className="mt-3 text-sm text-muted-foreground">
                {o.items.length} item(s) ordered
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
