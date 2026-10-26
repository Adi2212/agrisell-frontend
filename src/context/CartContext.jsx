import { createContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { cartApi } from "@/api/api";
import { useAuth } from "@/context/AuthContext";

export const CartContext = createContext({
  cart: [],
  addToCart: async () => {},
  updateQty: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
});

export function CartProvider({ children }) {
  const { token } = useAuth();
  
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (token) {
      syncWithBackend();
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, token]);

  const syncWithBackend = async () => {
    try {
      const saved = localStorage.getItem("cart");
      const localCart = saved ? JSON.parse(saved) : [];
      
      if (localCart.length > 0) {
        const syncData = localCart.map(item => ({ id: item.id, qty: item.qty }));
        const res = await cartApi.post("/sync", syncData);
        setCart(res.data);
        localStorage.removeItem("cart"); // clear local since synced
      } else {
        const res = await cartApi.get("/");
        setCart(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  const addToCart = async (product) => {
    if (token) {
      try {
        const res = await cartApi.post(`/add?productId=${product.id || product.productId}&qty=1`);
        setCart(res.data);
        toast.success("Product added to cart");
      } catch (err) {
        toast.error("Failed to add to cart");
      }
    } else {
      setCart((prev) => {
        const exist = prev.find((item) => item.id === (product.id || product.productId));
        toast.success("Product added to cart");
        if (exist) {
          return prev.map((item) =>
            item.id === (product.id || product.productId) ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [...prev, { ...product, id: product.id || product.productId, qty: 1 }];
      });
    }
  };

  const updateQty = async (id, qty) => {
    if (qty <= 0) return;
    if (token) {
      try {
        const res = await cartApi.put(`/update?productId=${id}&qty=${qty}`);
        setCart(res.data);
      } catch (err) {
        toast.error("Failed to update cart");
      }
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty } : item))
      );
    }
  };

  const removeFromCart = async (id) => {
    if (token) {
      try {
        const res = await cartApi.delete(`/remove/${id}`);
        setCart(res.data);
      } catch (err) {
        toast.error("Failed to remove item");
      }
    } else {
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const clearCart = async () => {
    if (token) {
      try {
        await cartApi.delete("/clear");
        setCart([]);
      } catch (err) {
        console.error("Failed to clear cart", err);
      }
    } else {
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
