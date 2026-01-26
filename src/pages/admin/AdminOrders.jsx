import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/api";
import Layout from "../../components/Layout";
import { adminMenu } from "../../constants/menus";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
      setOrders(res.data.content);
      setTotalPages(res.data.totalPages);
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
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>

        {/* Orders Table */}
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-muted text-primary">
            <tr>
              <th className="p-2">Order ID</th>
              <th className="p-2">Buyer</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-2">#{order.id}</td>
                <td className="p-2">{order.buyerName}</td>
                <td className="p-2">₹{order.totalAmount}</td>

                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded  text-sm font-semibold ${order.status === "PENDING"
                        ? "text-yellow-600"
                        : order.status === "CONFIRMED"
                          ? "text-blue-600"
                          : order.status === "SHIPPED"
                            ? "text-indigo-600"
                            : order.status === "DELIVERED"
                              ? "text-green-600"
                              : "text-red-600"
                      }`}
                  >
                    {order.status}
                  </span>
                </td>


                <td className="p-2 text-right">
                  <button
                    onClick={() => setSelectedOrderId(order.id)}
                    className="px-3 py-1 bg-primary text-white rounded"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50"
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
