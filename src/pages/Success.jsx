import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { orderApi } from "@/api/api";
import { toast } from "sonner";

import { CartContext } from "@/context/CartContext";

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { clearCart } = useContext(CartContext);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const markSuccess = async () => {
      try {
        if (!orderId) {
          toast.error("Order ID missing");
          return;
        }

        // Confirm payment
        await orderApi.put(`/${orderId}/payment-success`);

        // Clear cart after successful payment
        clearCart();

        toast.success("Payment successful. Cart cleared.");
      } catch (err) {
        console.error(err);
        toast.error("Failed to confirm payment");
      }

      // Redirect after 3 sec
      setTimeout(() => {
        navigate("/buyer/orders");
      }, 3000);
    };

    markSuccess();
  }, [orderId, navigate, clearCart]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary/10">
      <div className="bg-card p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-primary mb-3">
          Payment Successful
        </h1>

        <p className="text-muted-foreground mb-4">
          Your payment has been completed successfully.
        </p>

        <p className="text-sm text-muted-foreground">
          Redirecting to your orders page...
        </p>
      </div>
    </div>
  );
}
