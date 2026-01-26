import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/api";
import { toast } from "sonner";

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
      setStatus(res.data.status);
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

      fetchOrder();
      loadOrder();
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  // Loading state
  if (loading) return <p className="p-4">Loading...</p>;
  if (!order) return <p className="p-4">Order not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>

      {/* Order Summary */}
      <div className="bg-background shadow p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-3">Order Summary</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <p>
            <strong>Buyer:</strong> {order.buyerName}
          </p>

          <p>
            <strong>Status:</strong> {order.status}
          </p>

          <p>
            <strong>Total Amount:</strong> ₹{order.totalAmount}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          {/* Status Update Dropdown */}
          <div className="sm:col-span-2 flex items-center gap-2 mt-2">
            <select
              className="border p-2 rounded w-full sm:w-1/3"
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
              disabled={updating}
              onClick={handleStatusUpdate}
              className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-background shadow p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-3">Items</h2>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="p-2 border">{item.productName}</td>
                <td className="p-2 border">₹{item.price}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">
                  ₹{item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order History */}
      <div className="bg-background shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Order History</h2>

        <ul className="list-disc list-inside text-sm space-y-1">
          {order.history.map((entry) => (
            <li key={entry.id}>
              <strong>
                {new Date(entry.changedAt).toLocaleString()}:
              </strong>{" "}
              {entry.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
