import { useEffect, useState } from "react";
import { loadJson, buildCartItems } from "../data/studentData";

// Loads the cart of one customer.
// customerId 101 = cart 1, 103 = cart 2, 104 = cart 3 (see carts.json)
export default function useCartItems(customerId = 101) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadJson("carts"), loadJson("products"), loadJson("categories")])
      .then(([carts, products, categories]) => {
        if (cancelled) return;
        const cart = carts.find((c) => c.customerId === customerId);
        setItems(buildCartItems(cart, products, categories));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [customerId]);

  return { items, loading, error };
}