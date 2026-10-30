import { useEffect, useState } from "react";
import bloomEssence from "../assets/images/bloom-essence.png";
// import cleanser from "../assets/images/gentle-cleanser.png";   // add your photos here

// Photo for each product id. Anything not listed uses the default photo.
const IMAGES = {
  // 101: cleanser,
};

const BASE = "/student-data";
let cache = null; // shared by all pages, so the files are fetched once

async function getJson(file) {
  const res = await fetch(`${BASE}/${file}`);
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  return res.json();
}

async function load() {
  const [rawProducts, rawCategories] = await Promise.all([
    getJson("products.json"),
    getJson("categories.json"),
  ]);

  const categoryById = Object.fromEntries(rawCategories.map((c) => [c.id, c]));

  const products = rawProducts
    .filter((p) => p.active !== false) // hide inactive products
    .map((p) => {
      const image = IMAGES[p.id] ?? p.image ?? bloomEssence;
      const images =
        Array.isArray(p.images) && p.images.length ? p.images : [image];
      const stock = Number(p.stockQuantity);
      const category = categoryById[p.categoryId];

      return {
        ...p,
        id: Number(p.id),
        price: Number(p.price),
        category: category?.name ?? category?.title ?? "",
        image: images[0],
        images,
        badge: p.badge ?? (stock > 0 && stock <= 10 ? "Low stock" : undefined),
        tagline: p.tagline ?? p.brand,
        description: p.description ?? `${p.name} by ${p.brand}.`,
      };
    });

  return { products, categories: rawCategories };
}

export function useProducts() {
  const [state, setState] = useState(
    cache
      ? { ...cache, loading: false, error: null }
      : { products: [], categories: [], loading: true, error: null },
  );

  useEffect(() => {
    if (cache) return;
    let cancelled = false;

    load()
      .then((data) => {
        cache = data;
        if (!cancelled) setState({ ...data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            products: [],
            categories: [],
            loading: false,
            error: err.message,
          });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
