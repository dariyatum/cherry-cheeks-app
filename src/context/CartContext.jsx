import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "../auth";

const CartContext = createContext(null);

const keyFor = (user) => (user ? `cart_${user.id}` : null);

function readCart(key) {
  if (!key) return [];
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const user = getUser();
  const key = keyFor(user);

  const [items, setItems] = useState(() => readCart(key));
  const [loadedKey, setLoadedKey] = useState(key);

  // When someone logs in or out, load THEIR cart (logged out = empty)
  useEffect(() => {
    setItems(readCart(key));
    setLoadedKey(key);
  }, [key]);

  // Save every change to this user's cart
  useEffect(() => {
    if (key && loadedKey === key) {
      localStorage.setItem(key, JSON.stringify(items));
    }
  }, [items, key, loadedKey]);

  // Add a product (or increase its quantity if it is already in the cart)
  const addItem = (product, qty = 1) => {
    if (!user) return;
    const stock = product.stock ?? 99;

    setItems((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, qty: Math.min(stock, p.qty + qty) }
            : p
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || product.images?.[0],
          tagline: product.tagline,
          detail: product.detail,
          stock,
          qty: Math.min(stock, qty),
        },
      ];
    });
  };

  const removeItem = (id) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const clearCart = () => setItems([]);

  const count = items.reduce((sum, p) => sum + p.qty, 0);
  const total = items.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        setItems,
        addItem,
        removeItem,
        clearCart,
        count,
        total,
        loading: false,
        error: null,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}