import React, { useEffect, useState, useMemo } from "react";
import { adminApi } from "../../api/api";
import { toast } from "sonner";
import { formatOrderDateTime } from "@/lib/utils";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";

export default function AdminOrderDetails({ orderId, loadOrder }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch order details by id
  const fetchOrder = async () => {
    try {
      setLoading(true);

      const res = await adminApi.get(`/orders/${orderId}`);
      setOrder(res.data);
      setStatus(res.data.status || "PENDING");
    } catch {
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  // Load order when orderId changes
  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  // Filter out consecutive duplicate statuses from history for display
  const cleanHistory = useMemo(() => {
    if (!order?.history || !Array.isArray(order.history)) return [];
    return order.history.filter((entry, idx, arr) => {
      if (idx === 0) return true;
      return entry.status !== arr[idx - 1].status;
    });
  }, [order?.history]);

  // Update order status
  const handleStatusUpdate = async () => {
    if (!order) return;

    if (status === order.status) {
      toast.warning("Order already in this status");
      return;
    }

    try {
      setUpdating(true);

      await adminApi.put(`/orders/${order.id}/status/${status}`);

      toast.success("Order status updated successfully");

      await fetchOrder();
      if (loadOrder) loadOrder();
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  // Loading state
  if (loading) return <p className="p-4 text-muted-foreground">Loading order details...</p>;
  if (!order) return <p className="p-4 text-destructive">Order not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-primary" />
          {formatOrderDateTime(order.createdAt)}
        </span>
      </div>

      {/* Order Summary */}
      <div className="bg-background shadow p-5 rounded-xl border">
        <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <p>
            <strong className="text-muted-foreground">Buyer:</strong>{" "}
            <span className="font-semibold">{order.buyerName}</span>
          </p>

          <p>
            <strong className="text-muted-foreground">Current Status:</strong>{" "}
            <span className="font-semibold text-primary">{order.status}</span>
          </p>

          <p>
            <strong className="text-muted-foreground">Total Amount:</strong>{" "}
            <span className="font-bold text-base text-foreground">₹{order.totalAmount}</span>
          </p>

          <p>
            <strong className="text-muted-foreground">Order Date:</strong>{" "}
            <span className="font-medium">{formatOrderDateTime(order.createdAt)}</span>
          </p>

          {/* Status Update Dropdown */}
          <div className="sm:col-span-2 flex items-center gap-2 mt-2 pt-3 border-t">
            <select
              className="border p-2 rounded-lg text-sm bg-background w-full sm:w-1/3"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button
              disabled={updating || !status || status === order.status}
              onClick={handleStatusUpdate}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {updating ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-background shadow p-5 rounded-xl border">
        <h2 className="text-lg font-semibold mb-3">Items</h2>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="p-2.5 text-left border">Product</th>
              <th className="p-2.5 text-right border">Price</th>
              <th className="p-2.5 text-center border">Qty</th>
              <th className="p-2.5 text-right border">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {order.items && order.items.length ? (
              order.items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30">
                  <td className="p-2.5 border font-medium">{item.productName}</td>
                  <td className="p-2.5 text-right border">₹{item.price}</td>
                  <td className="p-2.5 text-center border">{item.quantity}</td>
                  <td className="p-2.5 text-right border font-bold">
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                  No items in this order
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order History Timeline with Accurate Dates */}
      <div className="bg-background shadow p-5 rounded-xl border">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Order History Timeline
        </h2>

        {cleanHistory && cleanHistory.length > 0 ? (
          <div className="border-l-2 border-primary/30 ml-3 pl-4 space-y-3.5 my-2">
            {cleanHistory.map((entry, idx) => {
              const dateDisplay = formatOrderDateTime(entry.changedAt || entry.createdAt);
              return (
                <div key={entry.id || idx} className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="font-semibold text-sm">
                      Status: <span className="text-primary">{entry.status}</span>
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {dateDisplay}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No history records available for this order.
          </p>
        )}
      </div>
    </div>
  );
}
