import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/api";
import Layout from "../../components/Layout";
import { adminMenu } from "../../constants/Menus";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatOrderDateTime } from "@/lib/utils";

import AdminOrderDetailsPage from "./AdminOrderDetails";
import OrderDetailsModal from "@/components/OrderDetailsModal";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const size = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const res = await adminApi.get(`/orders?page=${page}&size=${size}`);
      setOrders(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  return (
    <Layout
      title="Orders"
      menuItems={adminMenu}
      onLogout={() => {
        sessionStorage.clear();
        navigate("/");
      }}
    >
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Orders Management</h1>

        {/* Orders Table */}
        <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted text-primary">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Date & Time</th>
                <th className="p-3 text-left">Buyer</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {orders.length ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition">
                    <td className="p-3 font-semibold">#{order.id}</td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {formatOrderDateTime(order.createdAt)}
                    </td>
                    <td className="p-3 font-medium">{order.buyerName}</td>
                    <td className="p-3 font-semibold">₹{order.totalAmount}</td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400"
                            : order.status === "CONFIRMED"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400"
                            : order.status === "SHIPPED"
                            ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400"
                            : order.status === "DELIVERED"
                            ? "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedOrderId(order.id)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition shadow-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-xs font-semibold"
          >
            Previous
          </button>

          <span className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages || 1}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-xs font-semibold"
          >
            Next
          </button>
        </div>

        {/* Modal Popup */}
        {selectedOrderId && (
          <OrderDetailsModal onClose={() => setSelectedOrderId(null)}>
            <AdminOrderDetailsPage
              orderId={selectedOrderId}
              loadOrder={fetchOrders}
            />
          </OrderDetailsModal>
        )}
      </main>
    </Layout>
  );
}
