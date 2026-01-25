import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { orderApi } from "../api/api";

export default function Cancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (orderId) {
      // 🔹 Mark order as FAILED
      orderApi.put(`/${orderId}/payment-failed`)
        .catch(() => {});
    }

    //Redirect after 2 seconds
    const timer = setTimeout(() => {
      navigate("/buyer/orders");
    }, 2000);

    return () => clearTimeout(timer);
  }, [orderId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-destructive/10">
      <div className="bg-card p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-destructive/70 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-muted-foreground mb-4">
          You cancelled the payment.
        </p>
        <p className="text-sm text-muted-foreground">
          Redirecting to orders page...
        </p>
      </div>
    </div>
  );
}
