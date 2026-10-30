import { useEffect, useState } from "react";

const BASE = "/student-data";
const KEY = "cc-admin-products";

// "Body Care" -> "body-care", used in the page address
export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function getJson(file) {
  const res = await fetch(`${BASE}/${file}`);
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  const type = res.headers.get("content-type") || "";
  if (!type.includes("json"))
    throw new Error(`${file} was not found in public/student-data`);
  return res.json();
}

const normalize = (p) => ({
  ...p,
  id: Number(p.id),
  categoryId: Number(p.categoryId),
  price: Number(p.price),
  stockQuantity: Number(p.stockQuantity),
  active: p.active !== false,
});

function readSaved() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(list) ? list : null;
  } catch {
    return null;
  }
}

export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the files once, when the page opens
  useEffect(() => {
    let cancelled = false;
    Promise.all([getJson("products.json"), getJson("categories.json")])
      .then(([rawProducts, rawCategories]) => {
        if (cancelled) return;
        setCategories(rawCategories);
        setProducts(readSaved() ?? rawProducts.map(normalize));
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Save every change in this browser
  useEffect(() => {
    if (loading || error) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(products));
    } catch {
      // storage can be blocked, edits still work for this visit
    }
  }, [products, loading, error]);

  function add(data) {
    setProducts((prev) => [
      { ...data, id: Math.max(0, ...prev.map((p) => p.id)) + 1 },
      ...prev,
    ]);
  }

  function update(id, data) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
    );
  }

  function remove(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function reset() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
    const raw = await getJson("products.json");
    setProducts(raw.map(normalize));
  }

  return { products, categories, loading, error, add, update, remove, reset };
}
