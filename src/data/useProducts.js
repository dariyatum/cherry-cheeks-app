import { useEffect, useState } from "react";
import bloomEssence from "../assets/images/bloom-essence.png";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getProducts() {
      try {
        // Get products and categories
        const productResponse = await fetch("/student-data/products.json");
        const productsData = await productResponse.json();

        const categoryResponse = await fetch("/student-data/categories.json");
        const categoriesData = await categoryResponse.json();

        // Make a new list of products
        const newProducts = [];

        for (const product of productsData) {
          // Skip products that are inactive
          if (product.active === false) {
            continue;
          }

          // Find the category name
          let categoryName = "";

          for (const category of categoriesData) {
            if (category.id == product.categoryId) {
              categoryName = category.name || category.title || "";
              break;
            }
          }

          // Get the product image
          const image = product.image || bloomEssence;

          // Create the product
          newProducts.push({
            id: Number(product.id),
            name: product.name,
            brand: product.brand,
            price: Number(product.price),
            stockQuantity: Number(product.stockQuantity),
            category: categoryName,
            image: image,
            images: product.images || [image],
            badge: product.badge || "",
            tagline: product.tagline || product.brand,
            description:
              product.description ||
              product.name + " by " + product.brand + ".",
          });
        }

        // Save products and categories
        setProducts(newProducts);
        setCategories(categoriesData);
      } catch (error) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  return { products, categories, loading, error };
}
