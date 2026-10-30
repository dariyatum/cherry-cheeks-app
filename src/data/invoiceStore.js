const KEY = "cherryInvoices";

// Read the invoices saved by checkout
export function getSavedInvoices() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

// Make a new invoice from the cart and save it
// items = cart items (they need id, price, qty)
// method = "CARD", "QR" or "CASH"
export function createInvoice({ items, email, method, discount = 0, tax = 0 }) {
  const saved = getSavedInvoices();

  // Next id: bigger than 327 (the last invoice in your JSON) and bigger than any saved one
  const nextId = Math.max(327, ...saved.map((i) => i.id)) + 1;

  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, ""); // 20261028

  const lines = items.map((p) => ({
    productId: p.id,
    quantity: p.qty,
    unitPrice: p.price,
    lineTotal: p.price * p.qty,
  }));

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const total = subtotal - discount + tax;

  const invoice = {
    id: nextId,
    invoiceNumber: `INV-${ymd}-${String(nextId).padStart(5, "0")}`,
    createdAt: now.toISOString(),
    createdByAccountId: null,
    cashierId: null,
    customerId: null,
    customerEmail: email,
    status: "PAID",
    currency: "USD",
    items: lines,
    subtotal,
    discount,
    tax,
    total,
    payments: [{ method, amount: total, reference: null }],
  };

  localStorage.setItem(KEY, JSON.stringify([invoice, ...saved]));
  return invoice;
}