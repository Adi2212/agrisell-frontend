import { createContext, useState, useEffect } from "react";
import { toast } from "sonner";

export const CartContext = createContext({
  cart: [],
  addToCart: () => { },
  updateQty: () => { },
  removeFromCart: () => { },
});

export function CartProvider({ children }) {
 const [cart, setCart] = useState(() => {
        // Load from localstorage if exists
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
toast.success("Product added to cart");
      if (exist) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return; // prevent zero qty
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

   const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
