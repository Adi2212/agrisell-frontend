import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";

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
        <p className="p-6">Loading...</p>
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

  const canCancel =
    status === "PENDING" || status === "CONFIRMED";

  const currentStep = steps.indexOf(status);

  return (
    <Layout title="Order Details" menuItems={buyerMenu}>
      <div className="max-w-3xl mx-auto p-6 space-y-6">

        {/* Order Info */}
        <Card className="p-6 space-y-2">
          <h2 className="text-xl font-bold">
            Order ID: {order.orderId}
          </h2>

          <p>
            Total Amount: <b>₹{order.totalAmount}</b>
          </p>

          <p className="text-sm text-muted-foreground">
            Ordered on: {new Date(order.createdAt).toLocaleString()}
          </p>

          {/* Cancelled Message */}
          {isCancelled && (
            <p className="text-red-600 font-semibold mt-2">
              This Order was Cancelled
            </p>
          )}

          {/* Cancel Button with Alert Dialog */}
          {canCancel && !isCancelled && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mt-4">
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
                <Button variant="outline" className="mt-3">
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

        {/* Progress Tracker */}
        {!isCancelled && (
          <Card className="p-6">
            <h3 className="font-semibold mb-6">
              Order Status Progress
            </h3>

            <div className="relative flex justify-between items-center">
              <div className="absolute top-4 left-0 right-0 h-1 bg-muted rounded-full" />

              <div
                className="absolute top-4 left-0 h-1 bg-primary rounded-full"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              />

              {steps.map((step, index) => (
                <div
                  key={step}
                  className="relative flex flex-col items-center flex-1"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10
                      ${index <= currentStep
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {index + 1}
                  </div>

                  <p
                    className={`mt-2 text-xs font-medium
                      ${index <= currentStep
                        ? "text-primary"
                        : "text-muted-foreground"
                      }`}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Items */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Items</h3>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.product.productId}
                className="flex justify-between border-b pb-2 cursor-pointer"
              >
                <p onClick={() => navigate(`/product/${item.product.productId}`)}>
                  {item.product.productName}
                </p>
                <p>
                  {item.quantity} × ₹{item.price}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
