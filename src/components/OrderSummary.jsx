import React from "react";

// ---------- 1. CSS (internal) ----------
// All styles live in this one text block.
const styles = `
  /* The white box around everything */
  .order-box {
    width: 100%;
    max-width: 400px;
    padding: 28px;
    background: #fffdfa;
    border: 1px solid #eadfd6;
    border-radius: 24px;
    font-family: Arial, sans-serif;
    color: #3d3530;
    box-sizing: border-box;
  }

  /* Title row: "Order summary" + "4 items" */
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  .order-title {
    margin: 0;
    font-family: Georgia, serif;
    font-size: 26px;
    font-weight: normal;
  }
  .order-count {
    font-size: 12px;
    color: #8a7a70;
  }

  /* One product row: picture on the left, text on the right */
  .product {
    display: flex;
    gap: 16px;
    margin-bottom: 18px;
  }
  .product-image {
    width: 88px;
    height: 104px;
    border-radius: 14px;
    background: #f5ede6;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .product-name {
    margin: 4px 0 6px;
    font-family: Georgia, serif;
    font-size: 17px;
    font-weight: normal;
  }
  .product-detail {
    margin: 0 0 8px;
    font-size: 12px;
    color: #8a7a70;
  }
  .product-price {
    margin: 0;
    font-size: 14px;
  }

  /* Thin line between sections */
  .line {
    border: 0;
    border-top: 1px solid #eadfd6;
    margin: 24px 0;
  }

  /* Rows like "Subtotal ........ £138.00" */
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
    font-size: 14px;
    color: #8a7a70;
  }
  .row span:last-child {
    color: #3d3530;
  }

  /* Big total row */
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    font-family: Georgia, serif;
    font-size: 26px;
  }

  /* The purple button */
  .order-button {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 999px;
    background: #8b4a5e;
    color: white;
    font-size: 14px;
    cursor: pointer;
  }
  .order-button:hover {
    background: #763d4e;
  }

  /* "Secure checkout" text */
  .os-secure {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  font-size: 11px;
  color: var(--os-muted);
}
`;

// ---------- 2. Sample products ----------
// Used only if the page does not send its own "items".
const sampleItems = [
  { id: 1, name: "Botanical Dew Serum", detail: "30 ml", qty: 1, price: 48, color: "#c9955c" },
  { id: 2, name: "Cloud Soft Moisturiser", detail: "50 ml", qty: 1, price: 42, color: "#e3cdb0" },
  { id: 3, name: "Petal Lip Tint", detail: "Rosewood · 4 g", qty: 2, price: 24, color: "#a8576d" },
];

// ---------- 3. Helper: show a number as money ----------
// Example: 48 becomes "£48.00"
function showMoney(number) {
  return "£" + number.toFixed(2);
}

// ---------- 4. The component ----------
// These are the "props" the page can send in.
function OrderSummary({
  items = sampleItems,
  deliveryFee = 0,
  buttonLabel = "Continue to billing & shipping",
  onContinue = () => {},
}) {
  // Count all items (1 + 1 + 2 = 4)
  let itemCount = 0;
  // Add up all prices (price x quantity)
  let subtotal = 0;

  items.forEach((item) => {
    itemCount = itemCount + item.qty;
    subtotal = subtotal + item.price * item.qty;
  });

  const total = subtotal + deliveryFee;

  // VAT is already inside the price (20%)
  const vat = total - total / 1.2;

  return (
    <>
      <style>{styles}</style>

      <div className="order-box">
        {/* Title */}
        <div className="order-header">
          <h2 className="order-title">Order summary</h2>
          <span className="order-count">{itemCount} items</span>
        </div>

        {/* Product list */}
        {items.map((item) => (
          <div className="product" key={item.id}>
            <div className="product-image">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                // No picture? Show a small colored box instead
                <div
                  style={{
                    width: 30,
                    height: 56,
                    borderRadius: 6,
                    background: item.color,
                  }}
                ></div>
              )}
            </div>

            <div>
              <h3 className="product-name">{item.name}</h3>
              <p className="product-detail">
                {item.detail} · Qty {item.qty}
              </p>
              <p className="product-price">{showMoney(item.price * item.qty)}</p>
            </div>
          </div>
        ))}

        <hr className="line" />

        {/* Money rows */}
        <div className="row">
          <span>Subtotal</span>
          <span>{showMoney(subtotal)}</span>
        </div>
        <div className="row">
          <span>Standard delivery</span>
          <span>{deliveryFee === 0 ? "Complimentary" : showMoney(deliveryFee)}</span>
        </div>
        <div className="row">
          <span>VAT included</span>
          <span>{showMoney(vat)}</span>
        </div>

        <hr className="line" />

        {/* Total */}
        <div className="total">
          <span>Total</span>
          <span>{showMoney(total)}</span>
        </div>

        {/* Button */}
        <button className="order-button" onClick={onContinue}>
          {buttonLabel} →
        </button>

        <div className="os-secure">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          Secure checkout · encrypted &amp; protected
        </div>
      </div>
    </>
  );
}

export default OrderSummary;