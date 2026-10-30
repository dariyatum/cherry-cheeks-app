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
        // Get products
        const productResponse = await fetch("/student-data/products.json");

        const productData = await productResponse.json();

        // Get categories
        const categoryResponse = await fetch("/student-data/categories.json");

        const categoryData = await categoryResponse.json();

        // Create a new product list
        const newProducts = [];

        for (let i = 0; i < productData.length; i++) {
          const product = productData[i];

          // Skip inactive products
          if (product.active === false) {
            continue;
          }

          // Find the product category
          let categoryName = "";

          for (let j = 0; j < categoryData.length; j++) {
            if (categoryData[j].id == product.categoryId) {
              categoryName =
                categoryData[j].name || categoryData[j].title || "";
              break;
            }
          }

          // Choose product image
          let image = product.image || bloomEssence;

          // Create product information
          const newProduct = {
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
          };

          // Show low stock message
          if (
            !newProduct.badge &&
            newProduct.stockQuantity > 0 &&
            newProduct.stockQuantity <= 10
          ) {
            newProduct.badge = "Low stock";
          }

          newProducts.push(newProduct);
        }

        // Save data
        setProducts(newProducts);
        setCategories(categoryData);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
  };
}
