import { createContext, useContext, useEffect, useState } from "react";
import useCartItems from "../hooks/useCartItems";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Starting cart from the teacher's carts.json (customer 101)
  const { items: jsonItems, loading, error } = useCartItems(101);
  const [items, setItems] = useState([]);
  const [seeded, setSeeded] = useState(false);

  // When the JSON arrives, put it in the cart once.
  // Keep anything the customer already added before it arrived.
  useEffect(() => {
    if (loading || seeded) return;
    setItems((added) => [
      ...jsonItems,
      ...added.filter((a) => !jsonItems.some((j) => j.id === a.id)),
    ]);
    setSeeded(true);
  }, [loading, seeded, jsonItems]);

  // Add a product from the product page
  function addItem(product, qty = 1) {
    const stock = Number(product.stockQuantity) || 99;

    setItems((current) => {
      const found = current.find((i) => i.id === product.id);

      // Already in the cart: increase the quantity (never above the stock)
      if (found) {
        return current.map((i) =>
          i.id === product.id ? { ...i, qty: Math.min(stock, i.qty + qty) } : i
        );
      }

      // New product: add a row in the same shape the pages already use
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          tagline: product.category,
          detail: product.brand,
          qty: Math.min(stock, qty),
          price: product.price,
          stock,
          color: "#e3cdb0",
        },
      ];
    });
  }

  // Total quantity, for the header badge
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, setItems, addItem, count, loading, error }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}