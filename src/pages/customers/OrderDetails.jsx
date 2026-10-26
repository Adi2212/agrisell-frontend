import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Layout from "@/components/Layout";
import { buyerMenu } from "@/constants/Menus";
import { orderApi, paymentApi } from "@/api/api";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatOrderDateTime } from "@/lib/utils";
import { Calendar, Clock, CheckCircle2, PackageCheck } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import PaymentBadge from "@/components/PaymentBadge";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();

  const steps = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await orderApi.get(`/${id}`);
      setOrder(res.data);
    } catch {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  // Retry Payment Handler
  const retryPayment = async () => {
    try {
      const res = await paymentApi.post(
        `/retry/${order.orderId}`
      );

      // Redirect to Stripe Checkout
      window.location.href = res.data.sessionUrl;
    } catch (err) {
      console.error("Retry payment failed", err);
      toast.error("Unable to retry payment");
    }
  };

  // Cancel Order API Call
  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setCancelling(true);

      await orderApi.put(`/cancel/${order.orderId}`);

      toast.success("Order Cancelled Successfully");

      fetchOrder();
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Order Details" menuItems={buyerMenu}>
        <p className="p-6 text-muted-foreground">Loading order details...</p>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout title="Order Details" menuItems={buyerMenu}>
        <p className="p-6 text-red-500">Order not found</p>
      </Layout>
    );
  }

  const status = order.orderStatus;
  const isCancelled = status === "CANCELLED";
  const canCancel = status === "PENDING" || status === "CONFIRMED";
  const currentStep = steps.indexOf(status);

  // Helper to find date for a specific status step
  const getStepDate = (stepName) => {
    if (!order.history || !Array.isArray(order.history)) {
      if (stepName === "PENDING" && order.createdAt) {
        return formatOrderDateTime(order.createdAt);
      }
      return null;
    }
    const record = order.history.find((h) => h.status === stepName);
    if (record) {
      return formatOrderDateTime(record.changedAt || record.createdAt);
    }
    if (stepName === "PENDING" && order.createdAt) {
      return formatOrderDateTime(order.createdAt);
    }
    return null;
  };

  // Filter out consecutive duplicate statuses from history for display
  const cleanHistory = useMemo(() => {
    if (!order?.history || !Array.isArray(order.history)) return [];
    return order.history.filter((entry, idx, arr) => {
      if (idx === 0) return true;
      return entry.status !== arr[idx - 1].status;
    });
  }, [order?.history]);

  return (
    <Layout title="Order Details" menuItems={buyerMenu}>
      <div className="max-w-3xl mx-auto p-6 space-y-6">

        {/* Order Info Card */}
        <Card className="p-6 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-xl font-bold">
                Order #{order.orderId}
              </h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Placed on: <strong>{formatOrderDateTime(order.createdAt)}</strong></span>
              </p>
            </div>

            <div className="flex gap-2">
              <StatusBadge status={order.orderStatus} />
              <PaymentBadge status={order.paymentStatus} />
            </div>
          </div>

          <div className="pt-2 border-t flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Total Amount:</span>
            <span className="text-2xl font-bold text-primary">₹{order.totalAmount}</span>
          </div>

          {/* Cancelled Message */}
          {isCancelled && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg text-red-600 font-semibold text-sm">
              This Order was Cancelled
            </div>
          )}

          {/* Cancel Button with Alert Dialog */}
          {canCancel && !isCancelled && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mt-2">
                  Cancel Order
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Cancel this order?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone.
                    Your order will be marked as cancelled.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>
                    No, Keep Order
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    {cancelling ? "Cancelling..." : "Yes, Cancel"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Retry Payment Button */}
          {order.paymentStatus === "FAILED" && !isCancelled && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="mt-2">
                  Retry Payment
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Payment Failed
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    Your previous payment attempt failed.
                    Would you like to retry payment now?
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={retryPayment}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Yes, Retry Payment
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </Card>

        {/* Progress Tracker with Step Dates */}
        {!isCancelled && (
          <Card className="p-6">
            <h3 className="font-semibold text-base mb-6 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-primary" />
              Order Status Progress
            </h3>

            <div className="relative flex justify-between items-start">
              <div className="absolute top-5 left-8 right-8 h-1 bg-muted rounded-full" />

              {currentStep >= 0 && (
                <div
                  className="absolute top-5 left-8 h-1 bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, (currentStep / (steps.length - 1)) * 100))}%`,
                  }}
                />
              )}

              {steps.map((step, index) => {
                const isPassed = index <= currentStep;
                const stepDate = getStepDate(step);

                return (
                  <div
                    key={step}
                    className="relative flex flex-col items-center flex-1 text-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-colors shadow-sm
                        ${isPassed
                          ? "bg-primary text-primary-foreground ring-4 ring-background"
                          : "bg-muted text-muted-foreground ring-4 ring-background"
                        }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    <p
                      className={`mt-2 text-xs font-semibold
                        ${isPassed
                          ? "text-primary"
                          : "text-muted-foreground"
                        }`}
                    >
                      {step}
                    </p>

                    {/* Timestamp for this step */}
                    {stepDate && (
                      <span className="text-[11px] text-muted-foreground/80 mt-1 max-w-[100px] leading-tight">
                        {stepDate}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Order History Timeline (with timestamps) */}
        {order.history && order.history.length > 0 && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Order History Timeline
            </h3>

            <div className="border-l-2 border-primary/30 ml-3 pl-4 space-y-4">
              {cleanHistory.map((entry, idx) => (
                <div key={entry.id || idx} className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="font-semibold text-sm text-foreground">
                      Status updated to <span className="text-primary">{entry.status}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatOrderDateTime(entry.changedAt || entry.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Items Card */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 text-base">Items Ordered</h3>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.product.productId}
                className="flex justify-between items-center border-b pb-3 cursor-pointer hover:bg-muted/30 p-2 rounded-lg transition"
                onClick={() => navigate(`/product/${item.product.productId}`)}
              >
                <div>
                  <p className="font-medium text-sm text-foreground hover:text-primary transition">
                    {item.product.productName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">
                    ₹{item.price * item.quantity}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ₹{item.price} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
