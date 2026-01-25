import { Heart, ShoppingBag } from "lucide-react";

export default function ProductCard({ product, onClick, onAddToCart }) {
  return (
    <div
      onClick={() => onClick && onClick()}
      className="
        cursor-pointer rounded-3xl overflow-hidden
        bg-card text-foreground
        shadow-md hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-2
      "
    >
      {/* IMAGE SECTION */}
      <div className="relative h-52 flex items-center justify-center bg-muted">
        <img
          src={product.imgUrl}
          alt={product.name}
          className="h-40 object-contain"
        />

        {/* Wishlist */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="
            absolute top-3 right-3
            bg-background/80 backdrop-blur
            p-2 rounded-full
            hover:scale-110 transition
          "
        >
          <Heart className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* INFO SECTION */}
      <div className="p-5">
        <h3 className="font-semibold text-lg">{product.name}</h3>

        <p className="text-sm text-muted-foreground">
          {product.category?.name}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold">
            ₹{product.price}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="
              bg-primary text-primary-foreground
              p-3 rounded-2xl
              transition active:scale-95
            "
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
