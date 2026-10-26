import { Heart, ShoppingBag, Sparkles } from "lucide-react";

export default function ProductCard({ product, onClick, onAddToCart }) {
  const hasOffer = Boolean(
    product.offer &&
    product.discountedPrice !== undefined &&
    product.discountedPrice !== null &&
    product.discountedPrice < product.price
  );
  const displayPrice = hasOffer ? product.discountedPrice : product.price;

  return (
    <div
      onClick={() => onClick && onClick()}
      className="
        group cursor-pointer rounded-3xl overflow-hidden
        bg-card text-foreground
        shadow-md hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-2 border border-border/50
      "
    >
      {/* IMAGE SECTION */}
      <div className="relative h-52 flex items-center justify-center bg-muted/60 p-4">
        <img
          src={product.imgUrl}
          alt={product.name}
          className="h-40 w-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/300?text=Product";
          }}
        />

        {/* Offer Badge Top-Left */}
        {hasOffer && (
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
            <span className="bg-red-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 tracking-wide">
              <Sparkles className="w-3 h-3" />
              {product.offer.discountPercentage}% OFF
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="
            absolute top-3 right-3
            bg-background/80 backdrop-blur
            p-2 rounded-full
            hover:scale-110 transition shadow-sm
          "
        >
          <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500" />
        </button>
      </div>

      {/* INFO SECTION */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition">
            {product.name}
          </h3>

          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-sm text-muted-foreground">
              {product.category?.name || "General"}
            </p>

            {hasOffer && product.offer.title && (
              <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-full truncate max-w-[140px]">
                {product.offer.title}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-2 border-t border-border/40">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                ₹{displayPrice}
              </span>
              {hasOffer && (
                <span className="line-through text-muted-foreground text-sm font-normal">
                  ₹{product.price}
                </span>
              )}
            </div>
            {hasOffer && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                Save ₹{(product.price - displayPrice).toFixed(2)}
              </p>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            title="Add to cart"
            className="
              bg-primary text-primary-foreground
              p-3 rounded-2xl
              transition active:scale-95 hover:bg-primary/90 shadow-sm
            "
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
