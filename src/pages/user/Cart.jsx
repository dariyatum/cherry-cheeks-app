import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../components/OrderSummary";
import useCartItems from "../hooks/useCartItems";

// ---------- 1. CSS (internal) ----------
const styles = `
  .cart-page {
    min-height: 100vh;
    padding: 40px 0 80px;          /* no side padding here, the container controls it */
    background: #faf6f1;
    font-family: Arial, sans-serif;
    color: #3d3530;
  }

  /* Same box as the header: max-w-[90%] mx-auto px-5 md:px-8 */
  .cart-container {
    box-sizing: border-box;
    width: 100%;
    max-width: 90%;
    margin: 0 auto;
    padding: 0 20px;
  }
  @media (min-width: 768px) {
    .cart-container {
      padding: 0 32px;
    }
  }

  /* ----- Top: breadcrumb, title, subtitle ----- */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #8a7a70;
    margin-bottom: 16px;
  }
  .breadcrumb a {
    color: #8a7a70;
    text-decoration: none;
  }
  .breadcrumb svg {
    color: #8a7a70;
  }
  .breadcrumb .current {
    color: #8b4a5e;
  }
  .page-title {
    margin: 0 0 12px;
    font-family: Georgia, serif;
    font-size: 44px;
    font-weight: normal;
  }
  .page-subtitle {
    margin: 0 0 40px;
    font-size: 14px;
    color: #8a7a70;
  }

  /* ----- Steps bar ----- */
  .steps {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px;
    margin-bottom: 40px;
    background: #f5ede6;
    border-radius: 16px;
    overflow-x: auto;
    gap: 16px;
  }
  .step {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #8a7a70;
    white-space: nowrap;
  }
  .step-number {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1px solid #eadfd6;
    background: #fffdfa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
  }
  .step.active {
    color: #8b4a5e;
    font-weight: bold;
  }
  .step.active .step-number {
    background: #8b4a5e;
    border-color: #8b4a5e;
    color: white;
  }
  .step-line {
    flex: 1;
    min-width: 20px;
    height: 1px;
    background: #eadfd6;
  }

  /* ----- Two columns: left (main) and right (summary) ----- */
  .cart-layout {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 40px;
    align-items: start;
  }
  .left-column,
  .right-column {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* ----- Reusable white card ----- */
  .card {
    padding: 28px;
    background: #fffdfa;
    border: 1px solid #eadfd6;
    border-radius: 24px;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 24px;
  }
  .card-title {
    margin: 0;
    font-family: Georgia, serif;
    font-size: 26px;
    font-weight: normal;
  }
  .small-text {
    font-size: 12px;
    color: #8a7a70;
  }
  .link {
    color: #8b4a5e;
    font-size: 12px;
    text-decoration: none;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
  /* A link that has an icon next to the text */
  .link-icon {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  /* ----- Your bag table ----- */
  .bag-head,
  .bag-row {
    display: grid;
    grid-template-columns: 1fr 90px 120px 80px;
    gap: 16px;
    align-items: center;
  }
  .bag-head {
    font-size: 11px;
    letter-spacing: 1px;
    color: #8a7a70;
    margin-bottom: 16px;
  }
  .bag-head span:not(:first-child),
  .bag-row .align-right {
    text-align: right;
  }
  .bag-row {
    padding: 20px 0;
    border-top: 1px solid #eadfd6;
  }
  .bag-product {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .bag-image {
    width: 88px;
    height: 104px;
    flex-shrink: 0;
    border-radius: 14px;
    background: #f5ede6;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .bag-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .bag-name {
    margin: 0 0 8px;
    font-family: Georgia, serif;
    font-size: 20px;
    font-weight: normal;
  }
  .bag-detail {
    margin: 0 0 8px;
    font-size: 12px;
    color: #8a7a70;
  }

  /* Quantity box:  [ - 1 + ] */
  .qty-box {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 88px;
    padding: 8px 12px;
    border: 1px solid #eadfd6;
    border-radius: 8px;
    background: white;
    font-size: 13px;
    margin-left: auto;
  }
  .qty-box button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 16px;
    color: #3d3530;
    padding: 0 4px;
  }

  /* ----- Gift note checkbox ----- */
  .checkbox-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #8a7a70;
    cursor: pointer;
  }
  .checkbox-row input {
    width: 16px;
    height: 16px;
    accent-color: #8b4a5e;
  }
  .gift-row {
    padding-top: 20px;
    border-top: 1px solid #eadfd6;
  }

  /* ----- Email form ----- */
  .about-text {
    margin: 0 0 24px;
    font-size: 14px;
    color: #8a7a70;
  }
  .field-label {
    display: block;
    margin-bottom: 8px;
    font-size: 11px;
    letter-spacing: 1px;
    color: #8a7a70;
  }
  .input {
    width: 100%;
    padding: 16px;
    border: 1px solid #eadfd6;
    border-radius: 10px;
    background: #fffdfa;
    font-size: 14px;
    color: #3d3530;
    box-sizing: border-box;
  }
  .input:focus {
    outline: 2px solid #8b4a5e;
    outline-offset: 1px;
  }
  .error-text {
    margin: 8px 0 0;
    font-size: 12px;
    color: #b3261e;
  }
  .about-card .checkbox-row {
    margin-top: 20px;
  }

  /* ----- Bottom row: continue shopping + returns ----- */
  .bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .returns-note {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #8a7a70;
  }
  .returns-note svg {
    flex-shrink: 0;
  }

  /* ----- Help box (right column) ----- */
  .help-box {
    padding: 24px;
    background: #f5ede6;
    border-radius: 20px;
  }
  .help-title {
    margin: 0 0 8px;
    font-family: Georgia, serif;
    font-size: 20px;
    font-weight: normal;
  }
  .help-text {
    margin: 0 0 12px;
    font-size: 12px;
    color: #8a7a70;
  }

  /* ----- Promo code box (right column) ----- */
  .promo-row {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }
  .promo-row .input {
    padding: 14px 16px;
  }
  .apply-button {
    padding: 0 28px;
    border: 1px solid #eadfd6;
    border-radius: 999px;
    background: white;
    font-size: 14px;
    cursor: pointer;
  }
  .apply-button:hover {
    background: #f5ede6;
  }
  .promo-message {
    margin: 20px 0 0;
    font-size: 12px;
    color: #8a7a70;
  }

  /* ----- Empty bag message ----- */
  .empty-bag {
    padding: 40px 0;
    text-align: center;
    color: #8a7a70;
  }

  /* ----- Tablet and phone ----- */
  @media (max-width: 900px) {
    .cart-layout {
      grid-template-columns: 1fr;
    }
    .page-title {
      font-size: 32px;
    }
  }
  @media (max-width: 640px) {
    .card {
      padding: 20px;
    }
    .bag-head {
      display: none;
    }
    .bag-row {
      grid-template-columns: 1fr 1fr;
    }
    .bag-product {
      grid-column: 1 / -1;
    }
    .bag-row .align-right {
      text-align: left;
    }
    .qty-box {
      margin-left: 0;
    }
  }
`;

// ---------- 2. Page data ----------
// Products now come from the JSON files (see hooks/useCartItems.js).

const steps = ["Your bag", "Billing & shipping", "Payment", "Order review", "Confirmation"];

// Helper: 48 becomes "$48.00"
function showMoney(number) {
  return "$" + number.toFixed(2);
}

// ---------- 3. The page ----------
function Cart() {
  const navigate = useNavigate();

  // Load the cart from the JSON files (customer 101 = cart 1)
  const { items: loadedItems, loading, error } = useCartItems(101);

  // Things the page remembers (state)
  const [products, setProducts] = useState([]);
  const [giftNote, setGiftNote] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [news, setNews] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("One code per order. No code applied.");

  // Copy the loaded items into state so + / - / Remove still work
  useEffect(() => {
    setProducts(loadedItems);
  }, [loadedItems]);

  // Count items for the "Your bag" header
  let itemCount = 0;
  products.forEach((p) => {
    itemCount = itemCount + p.qty;
  });

  // Change quantity: amount is +1 or -1 (never below 1, never above the stock)
  function changeQty(id, amount) {
    const newList = products.map((p) => {
      if (p.id === id) {
        return { ...p, qty: Math.min(p.stock, Math.max(1, p.qty + amount)) };
      }
      return p;
    });
    setProducts(newList);
  }

  // Remove one product from the bag
  function removeProduct(id) {
    setProducts(products.filter((p) => p.id !== id));
  }

  // Apply promo code (demo only: it just shows a message)
  function applyPromo() {
    if (promoCode.trim() === "") {
      setPromoMessage("Please enter a code first.");
    } else {
      setPromoMessage('Code "' + promoCode.trim() + '" received.');
    }
  }

  // Go to the next page (only if the email looks valid)
  function goToBilling() {
    if (products.length === 0) {
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    // Send the items to the next page
    navigate("/billingshipping", { state: { items: products } });
  }

  return (
    <>
      <style>{styles}</style>

      <div className="cart-page">
        <div className="cart-container">
          {/* ----- Top ----- */}
          <div className="breadcrumb">
            <a href="/">Home</a>
            {/* Chevron icon */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="current">Cart</span>
          </div>
          <h1 className="page-title">Your beauty ritual begins here</h1>
          <p className="page-subtitle">
            A few thoughtfully chosen essentials. Review your bag, then make them yours.
          </p>

          {/* ----- Steps bar ----- */}
          <div className="steps">
            {steps.map((stepName, index) => (
              <React.Fragment key={stepName}>
                <div className={index === 0 ? "step active" : "step"}>
                  <span className="step-number">{index + 1}</span>
                  {stepName}
                </div>
                {index < steps.length - 1 && <div className="step-line"></div>}
              </React.Fragment>
            ))}
          </div>

          {/* ----- Two columns ----- */}
          <div className="cart-layout">
            {/* ===== LEFT COLUMN ===== */}
            <div className="left-column">
              {/* Card 1: Your bag */}
              <section className="card">
                <div className="card-header">
                  <h2 className="card-title">Your bag</h2>
                  <span className="small-text">
                    {products.length} essentials · {itemCount} items
                  </span>
                </div>

                {loading ? (
                  <p className="empty-bag">Loading your bag…</p>
                ) : error ? (
                  <p className="empty-bag">Could not load cart: {error}</p>
                ) : products.length === 0 ? (
                  <p className="empty-bag">Your bag is empty.</p>
                ) : (
                  <>
                    <div className="bag-head">
                      <span>PRODUCT</span>
                      <span>PRICE</span>
                      <span>QUANTITY</span>
                      <span>TOTAL</span>
                    </div>

                    {products.map((p) => (
                      <div className="bag-row" key={p.id}>
                        {/* Picture + name */}
                        <div className="bag-product">
                          <div className="bag-image">
                            {p.image ? (
                              <img src={p.image} alt={p.name} />
                            ) : (
                              <div
                                style={{
                                  width: 30,
                                  height: 56,
                                  borderRadius: 6,
                                  background: p.color,
                                }}
                              ></div>
                            )}
                          </div>
                          <div>
                            <h3 className="bag-name">{p.name}</h3>
                            <p className="bag-detail">
                              {p.tagline ? p.tagline + " · " : ""}
                              {p.detail}
                            </p>
                            <button className="link" onClick={() => removeProduct(p.id)}>
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price of one */}
                        <div className="align-right small-text">{showMoney(p.price)}</div>

                        {/* Quantity  - 1 + */}
                        <div>
                          <div className="qty-box">
                            <button onClick={() => changeQty(p.id, -1)}>−</button>
                            <span>{p.qty}</span>
                            <button onClick={() => changeQty(p.id, 1)}>+</button>
                          </div>
                        </div>

                        {/* Row total */}
                        <div className="align-right">{showMoney(p.price * p.qty)}</div>
                      </div>
                    ))}
                  </>
                )}

                {/* Gift note */}
                <div className="gift-row">
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={giftNote}
                      onChange={(e) => setGiftNote(e.target.checked)}
                    />
                    Add a complimentary gift note at the next step
                  </label>
                </div>
              </section>

              {/* Card 2: A little about you */}
              <section className="card about-card">
                <div className="card-header">
                  <h2 className="card-title">A little about you</h2>
                  <a className="link" href="/login">
                    Already have an account? Sign in
                  </a>
                </div>

                <p className="about-text">
                  Continue as a guest. We’ll send your receipt and delivery updates here.
                </p>

                <label className="field-label" htmlFor="email">
                  EMAIL ADDRESS *
                </label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <p className="error-text">{emailError}</p>}

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={news}
                    onChange={(e) => setNews(e.target.checked)}
                  />
                  Send me atelier news, new rituals and thoughtful offers (optional)
                </label>
              </section>

              {/* Bottom row */}
              <div className="bottom-row">
                <a className="link link-icon" href="/shop">
                  {/* Left arrow icon */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                  Continue shopping
                </a>

                <span className="returns-note">
                  {/* Package icon */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m7.5 4.27 9 5.15" />
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                  30-day returns on unopened essentials
                </span>
              </div>
            </div>

            {/* ===== RIGHT COLUMN ===== */}
            <div className="right-column">
              {/* Reused component: we send data with props */}
              <OrderSummary
                items={products}
                deliveryFee={0}
                buttonLabel="Continue to billing & shipping"
                onContinue={goToBilling}
              />

              {/* Help box */}
              <div className="help-box">
                <h3 className="help-title">A little help from the atelier?</h3>
                <p className="help-text">Our team is here to make your ritual effortless.</p>
                <a className="link" href="mailto:hello@maisonbeaute.com">
                  hello@maisonbeaute.com
                </a>
              </div>

              {/* Promo code */}
              <section className="card">
                <h2 className="card-title">Have an atelier code?</h2>
                <div style={{ height: 20 }}></div>
                <label className="field-label" htmlFor="promo">
                  PROMO CODE
                </label>
                <div className="promo-row">
                  <input
                    id="promo"
                    className="input"
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button className="apply-button" onClick={applyPromo}>
                    Apply
                  </button>
                </div>
                <p className="promo-message">{promoMessage}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;