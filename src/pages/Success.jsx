import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { orderApi } from "../api/api";

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Prefer orderId (recommended)
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const markSuccess = async () => {
     
        if (orderId) {
          orderApi.put(`/${orderId}/payment-success`)
        }
      
    };

    markSuccess();

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/buyer/orders");
    }, 3000);

    return () => clearTimeout(timer);
  }, [orderId, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary/30">
      <div className="bg-card p-8 rounded shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-primary/80 mb-3">
          Payment Successful
        </h1>

        <p className="text-muted-foreground mb-4">
          Your payment has been completed successfully.
        </p>

        <p className="text-sm text-muted-foreground">
          Redirecting to your orders page…
        </p>
      </div>
    </div>
  );
}
