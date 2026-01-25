export default function PaymentBadge({ status }) {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PAID: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${colors[status]}`}>
      Payment: {status}
    </span>
  );
}
