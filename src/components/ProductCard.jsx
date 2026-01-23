import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { Heart, ShoppingBag } from "lucide-react";



export default function ProductCard({ product, onClick, onAddToCart }) {
  return (
    <div
      onClick={() => onClick && onClick()}
      className="cursor-pointer rounded-3xl overflow-hidden
             shadow-lg hover:shadow-2xl
             transition-all duration-300
             hover:-translate-y-2"
    >

      {/* Image */}
      <div className="relative  p-4 h-52 flex items-center justify-center">
        <img src={product.imageUrl} alt={product.name} className="h-40 object-contain" />

        <button
          className="absolute top-3 right-3 bg-secondary p-2 rounded-full"
          onClick={(e) => e.stopPropagation()}  // prevents opening page
        >
          <Heart className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Info */}
      <div className="bg-secondary text-foreground p-4 rounded-t-3xl">
        <h3 className="font-semibold p-2 text-lg">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.category?.name}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold">₹{product.price}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-secondary p-2 rounded-2xl"
          >
            <ShoppingBag className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
