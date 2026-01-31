import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { buyerMenu } from "@/constants/Menus";

import { orderApi, userApi } from "@/api/api";
import { useNavigate } from "react-router-dom";

import StatusBadge from "@/components/StatusBadge";
import PaymentBadge from "@/components/PaymentBadge";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Orders
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.get("/user");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err);
      toast.error("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Retry Payment Handler
  const retryPayment = async (orderId) => {
    try {
      const res = await userApi.post(`/payments/retry/${orderId}`);

      // Redirect to Stripe Checkout
      window.location.href = res.data.sessionUrl;
    } catch (err) {
      console.error("Retry payment failed:", err);
      toast.error("Unable to retry payment. Please try again.");
    }
  };

  return (
    <Layout title="My Orders" menuItems={buyerMenu}>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          My Orders
        </h2>

        {/* Loading */}
        {loading && (
          <p className="text-muted-foreground">
            Loading your orders...
          </p>
        )}

        {/* Empty Orders */}
        {!loading && orders.length === 0 && (
          <p className="text-muted-foreground">
            You have not placed any orders yet.
          </p>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.orderId}
              onClick={() => navigate(`/buyer/orders/${o.orderId}`)}
              className="cursor-pointer p-5 border rounded-xl bg-card hover:shadow-md transition"
            >
              {/* Header */}
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

              {/* Retry Payment Button */}
              {o.paymentStatus === "FAILED" && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-3"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click navigation
                    retryPayment(o.orderId);
                  }}
                >
                  Retry Payment
                </Button>
              )}

              {/* Status Badges */}
              <div className="flex gap-2 mt-3">
                <StatusBadge status={o.orderStatus} />
                <PaymentBadge status={o.paymentStatus} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
