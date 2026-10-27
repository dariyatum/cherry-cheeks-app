import { useEffect, useState } from "react";
import { loadJson, buildInvoiceItems } from "../data/studentData";

// Loads an existing invoice from invoices.json.
// Takes the newest invoice of the customer (101 -> INV-20261017-00321).
// If the customer has none, it takes the newest invoice in the file.
export default function useInvoice(customerId = 101) {
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadJson("invoices"), loadJson("products"), loadJson("categories")])
      .then(([invoices, products, categories]) => {
        if (cancelled) return;

        const newestFirst = [...invoices].sort((a, b) => b.id - a.id);
        const found =
          newestFirst.find((inv) => inv.customerId === customerId) || newestFirst[0];

        setInvoice(found);
        setItems(buildInvoiceItems(found, products, categories));
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

  return { invoice, items, loading, error };
}