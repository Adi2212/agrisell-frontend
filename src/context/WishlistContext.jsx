import { createContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { wishlistApi, cartApi } from "@/api/api";
import { useAuth } from "@/context/AuthContext";

export const WishlistContext = createContext({
  wishlist: [],
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  moveToCart: async () => {},
});

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [token]);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistApi.get("/");
      setWishlist(res.data);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  };

  const addToWishlist = async (productId) => {
    if (!token) {
      toast.error("Please login to use wishlist");
      return;
    }
    try {
      const res = await wishlistApi.post(`/add?productId=${productId}`);
      setWishlist(res.data);
      toast.success("Saved for later");
    } catch (err) {
      toast.error("Failed to save item");
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!token) return;
    try {
      const res = await wishlistApi.delete(`/remove/${productId}`);
      setWishlist(res.data);
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const moveToCart = async (productId) => {
    if (!token) return;
    try {
      await wishlistApi.post(`/move-to-cart?productId=${productId}`);
      await fetchWishlist(); // Refresh wishlist
      // Normally we'd also force CartContext to refresh, or just rely on CartContext's own methods
      toast.success("Moved to cart");
      setTimeout(() => window.location.reload(), 1000); // Quick hack to sync both states if they don't share easily
    } catch (err) {
      toast.error("Failed to move to cart");
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, moveToCart }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
