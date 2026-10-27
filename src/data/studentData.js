const BASE = "/student-data";

/* -------------------------------------------------
   1. Read one JSON file.  Example: loadJson("products")
   ------------------------------------------------- */
export async function loadJson(name) {
  const res = await fetch(`${BASE}/${name}.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status} loading ${name}.json`);
  return res.json();
}

/* -------------------------------------------------
   2. Colours. The JSON has no colours or images,
      so we choose one colour per category.
   ------------------------------------------------- */
const CATEGORY_COLORS = {
  1: "#c9955c", // Skincare
  2: "#a8576d", // Makeup
  3: "#e3cdb0", // Haircare
  4: "#8b4a5e", // Fragrance
  5: "#d8cabf", // Body Care
};

/* -------------------------------------------------
   3. Build the items your pages use.
   carts.json only has { productId, quantity }.
   We look up the product and category to get the rest.
   Result: { id, name, tagline, detail, qty, price, stock, color }
   ------------------------------------------------- */
export function buildCartItems(cart, products, categories) {
  if (!cart) return [];

  return cart.items
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return null;

      const category = categories.find((c) => c.id === product.categoryId);

      return {
        id: product.id,
        name: product.name,
        tagline: category ? category.name : "",
        detail: product.brand,
        qty: line.quantity,
        price: product.price,
        stock: product.stockQuantity,
        color: CATEGORY_COLORS[product.categoryId] || "#e3cdb0",
      };
    })
    .filter(Boolean);
}

/* -------------------------------------------------
   4. Money helper: avoids 0.1 + 0.2 = 0.30000000000000004
   ------------------------------------------------- */
function round2(number) {
  return Math.round(number * 100) / 100;
}

/* -------------------------------------------------
   5. Next invoice number: INV-YYYYMMDD-NNNNN
   NNNNN is a sequence across all dates, so we continue
   from the highest number in invoices.json (00327 -> 00328).
   We use the LOCAL date, so Phnom Penh time is correct.
   ------------------------------------------------- */
export function createInvoiceNumber(invoices, date = new Date()) {
  const lastSequence = invoices.reduce((max, inv) => {
    const n = Number(inv.invoiceNumber.split("-")[2]);
    return n > max ? n : max;
  }, 0);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `INV-${year}${month}${day}-${String(lastSequence + 1).padStart(5, "0")}`;
}

/* -------------------------------------------------
   6. Build a new invoice with the same shape as one
   record in invoices.json. It is NOT saved anywhere,
   because the JSON files are read-only.
   ------------------------------------------------- */
const PAYMENT_METHOD_NAMES = {
  card: "CARD",
  paypal: "PAYPAL",
  applepay: "APPLE_PAY",
};

export function buildInvoice({
  invoices,
  items,
  deliveryFee = 0,
  paymentMethod = "card",
  customerId = 101,
  date = new Date(),
}) {
  const lines = items.map((item) => ({
    productId: item.id,
    quantity: item.qty,
    unitPrice: item.price,
    lineTotal: round2(item.price * item.qty),
  }));

  const subtotal = round2(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const total = round2(subtotal + deliveryFee);
  const invoiceNumber = createInvoiceNumber(invoices, date);
  const lastId = invoices.reduce((max, inv) => Math.max(max, inv.id), 0);

  return {
    id: lastId + 1,
    invoiceNumber,
    createdAt: date.toISOString(),
    customerId,
    status: "PAID",
    currency: "USD",
    items: lines,
    subtotal,
    discount: 0,
    tax: 0,
    deliveryFee, // extra field: the teacher's invoices have no delivery fee
    total,
    payments: [
      {
        method: PAYMENT_METHOD_NAMES[paymentMethod] || "CARD",
        amount: total,
        reference: null,
      },
    ],
  };
}
/* 7. Turn an invoice from invoices.json into the items your pages show.
      Uses unitPrice and quantity from the invoice itself. */
export function buildInvoiceItems(invoice, products, categories) {
  if (!invoice) return [];

  return invoice.items
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return null;

      const category = categories.find((c) => c.id === product.categoryId);

      return {
        id: product.id,
        name: product.name,
        tagline: category ? category.name : "",
        detail: product.brand,
        qty: line.quantity,
        price: line.unitPrice,
        stock: product.stockQuantity,
        color: CATEGORY_COLORS[product.categoryId] || "#e3cdb0",
      };
    })
    .filter(Boolean);
}