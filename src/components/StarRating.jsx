import { Star } from "lucide-react";

export default function StarRating({ rating, setRating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={28}
          className={`cursor-pointer transition ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-400"
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
}
