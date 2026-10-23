import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  ChevronRight,
  ArrowLeft,
  CreditCard,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

import OrderSummary from "../components/OrderSummary";

/* =====================================================
   PART 1: STYLES
   ===================================================== */

const styles = `
  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: #fffdfa;
  }

  button, input, select, textarea { font: inherit; }

  /* ----- Page wrapper -----
     Same box as the header: max-w-[90%] mx-auto px-5 md:px-8 */

  .page {
    box-sizing: border-box;
    width: 100%;
    max-width: 90%;
    margin: 0 auto;
    padding: 32px 20px 60px;
    font-family: Arial, sans-serif;
    color: #3d3530;
    background: #fffdfa;
  }

  @media (min-width: 768px) {
    .page {
      padding-left: 32px;
      padding-right: 32px;
    }
  }

  /* ----- Breadcrumb ----- */

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #8a7a70;
  }
  .breadcrumb a { color: inherit; text-decoration: none; }
  .breadcrumb .current { color: #8b4a5e; }

  /* ----- Page title ----- */

  .page-title {
    margin: 16px 0 12px;
    font-family: Georgia, serif;
    font-size: 48px;
    font-weight: normal;
    line-height: 1.2;
  }

  .page-subtitle {
    margin: 0 0 40px;
    font-size: 13px;
    line-height: 1.7;
    color: #8a7a70;
  }

  /* ----- Checkout steps ----- */

  .steps {
    display: flex;
    align-items: center;
    padding: 20px 28px;
    margin-bottom: 40px;
    background: #f5ede6;
    border-radius: 16px;
    overflow-x: auto;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #8a7a70;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .step-circle {
    width: 26px;
    height: 26px;
    min-width: 26px;
    border-radius: 50%;
    border: 1px solid #eadfd6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    background: #fffdfa;
  }

  .step.done .step-circle,
  .step.active .step-circle {
    background: #8b4a5e;
    border-color: #8b4a5e;
    color: white;
  }

  .step.active {
    color: #8b4a5e;
    font-weight: bold;
  }

  .step-line {
    flex: 1;
    min-width: 24px;
    height: 1px;
    background: #eadfd6;
    margin: 0 16px;
  }

  /* ----- Main layout ----- */

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 40px;
    align-items: start;
  }

  .main {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
  }

  .sidebar {
    position: sticky;
    top: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
  }

  .sidebar > * {
    max-width: 100%;
    min-width: 0;
  }

  /* ----- Cards ----- */

  .card {
    padding: 28px;
    background: #fffdfa;
    border: 1px solid #eadfd6;
    border-radius: 24px;
    box-shadow: 0 4px 16px rgba(61, 53, 48, 0.04);
    min-width: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 20px;
  }

  .card-title {
    margin: 0 0 12px;
    font-family: Georgia, serif;
    font-size: 28px;
    line-height: 1.3;
    font-weight: normal;
  }

  .card-header .card-title { margin: 0; }

  .card-note {
    margin: 0 0 24px;
    font-size: 13px;
    line-height: 1.6;
    color: #8a7a70;
  }

  .edit-link {
    font-size: 12px;
    color: #8b4a5e;
    text-decoration: none;
  }
  .edit-link:hover { text-decoration: underline; }

  /* ----- Payment options (radio rows) ----- */

  .pay-option {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 16px;
    margin-bottom: 20px;
    border: 1px solid #eadfd6;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: background 0.2s, border-color 0.2s;
  }

  .pay-option.selected {
    background: #f3e6ea;
    border-color: #8b4a5e;
  }

  .pay-option input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .radio {
    width: 18px;
    height: 18px;
    border: 1px solid #b9a99e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: #fffdfa;
  }

  .pay-option.selected .radio { border-color: #8b4a5e; }

  .pay-option.selected .radio::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #8b4a5e;
  }

  .pay-option input:focus-visible + .radio {
    outline: 2px solid #8b4a5e;
    outline-offset: 3px;
  }

  .pay-name { flex: 1; min-width: 0; }

  .pay-brand {
    font-weight: bold;
    white-space: nowrap;
  }

  .pay-footnote {
    margin: 0;
    font-size: 11px;
    line-height: 1.6;
    color: #8a7a70;
  }

  /* ----- Card form ----- */

  .card-form {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 18px;
    padding: 0 14px;
    margin-bottom: 20px;
  }

  .full { grid-column: 1 / -1; }

  .field { min-width: 0; }

  .field label {
    display: block;
    margin-bottom: 8px;
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #8a7a70;
    line-height: 1.5;
  }

  .input-wrap { position: relative; }

  .input {
    width: 100%;
    min-width: 0;
    height: 46px;
    padding: 0 14px;
    border: 1px solid #eadfd6;
    border-radius: 6px;
    background: #fffdfa;
    font-size: 13px;
    color: #3d3530;
    outline: none;
    appearance: none;
  }

  .input.has-icon { padding-right: 42px; }
  .input::placeholder { color: #b9a99e; }

  .input:focus {
    border-color: #8b4a5e;
    box-shadow: 0 0 0 2px rgba(139, 74, 94, 0.08);
  }

  .input.invalid { border-color: #b3261e; }

  .input-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #8a7a70;
    pointer-events: none;
  }

  .error-text {
    margin: 6px 0 0;
    font-size: 11px;
    color: #b3261e;
  }

  /* ----- Checkbox ----- */

  .check {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    line-height: 1.6;
    color: #8a7a70;
    cursor: pointer;
  }

  .check input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  .check-box {
    width: 16px;
    height: 16px;
    min-width: 16px;
    border: 1px solid #d8cabf;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background: #fffdfa;
  }

  .check input:checked + .check-box {
    background: #8b4a5e;
    border-color: #8b4a5e;
  }

  .check input:focus-visible + .check-box {
    outline: 2px solid #8b4a5e;
    outline-offset: 3px;
  }

  .check-box svg { opacity: 0; }
  .check input:checked + .check-box svg { opacity: 1; }

  /* ----- Billing details ----- */

  .billing-name {
    margin: 0 0 12px;
    font-size: 13px;
  }

  .billing-address {
    margin: 0 0 24px;
    font-size: 14px;
    line-height: 1.8;
    color: #8a7a70;
  }

  .same-note {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 11px;
    color: #8a7a70;
  }

  .same-note svg { color: #8b4a5e; }

  /* ----- Safe checkout banner ----- */

  .safe {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 22px 24px;
    background: #f5ede6;
    border-radius: 16px;
  }

  .safe svg {
    color: #8b4a5e;
    flex-shrink: 0;
  }

  .safe h3 {
    margin: 0 0 4px;
    font-family: Georgia, serif;
    font-size: 20px;
    font-weight: normal;
  }

  .safe p {
    margin: 0;
    font-size: 12px;
    color: #8a7a70;
  }

  /* ----- Back link ----- */

  .back-link {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 8px;
    font-size: 12px;
    color: #8b4a5e;
    text-decoration: none;
  }

  .back-link:hover { text-decoration: underline; }

  /* ----- Help box ----- */

  .help {
    padding: 22px 20px;
    background: #f5ede6;
    border-radius: 16px;
    overflow-wrap: anywhere;
  }

  .help h3 {
    margin: 0 0 10px;
    font-family: Georgia, serif;
    font-size: 20px;
    line-height: 1.4;
    font-weight: normal;
  }

  .help p {
    margin: 0 0 12px;
    font-size: 12px;
    line-height: 1.7;
    color: #8a7a70;
  }

  .help a {
    font-size: 12px;
    color: #8b4a5e;
    text-decoration: none;
  }

  .help a:hover { text-decoration: underline; }

  /* ----- Delivery summary (right column) ----- */

  .delivery-box {
    padding: 26px 24px;
    background: #e9dccb;
    border-radius: 16px;
  }

  .delivery-box .card-header { margin-bottom: 18px; }

  .delivery-box h3 {
    margin: 0;
    font-family: Georgia, serif;
    font-size: 26px;
    font-weight: normal;
  }

  .delivery-line {
    margin: 0 0 6px;
    font-size: 12px;
    line-height: 1.6;
  }

  .delivery-to {
    margin: 22px 0 0;
    font-size: 11px;
    color: #8a7a70;
  }

  /* ----- Tablet -----
     Only top/bottom padding changes, so left/right always matches the header. */

  @media (max-width: 1024px) {
    .page {
      padding-top: 28px;
      padding-bottom: 48px;
    }

    .layout {
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 24px;
    }

    .card { padding: 24px; }
    .card-title { font-size: 25px; }
    .steps { padding: 18px; }

    .step-line {
      margin: 0 10px;
      min-width: 16px;
    }
  }

  /* ----- Mobile and small tablets ----- */

  @media (max-width: 760px) {
    .page {
      padding-top: 24px;
      padding-bottom: 40px;
    }

    .page-title { font-size: 36px; }
    .page-subtitle { margin-bottom: 28px; }

    .layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }

    .sidebar { position: static; }

    .steps {
      margin-bottom: 28px;
      padding: 16px;
    }

    /* Show only the label of the active step */
    .step-label { display: none; }
    .step.active .step-label { display: inline; }

    .step-line {
      min-width: 12px;
      margin: 0 8px;
    }
  }

  /* ----- Small phones ----- */

  @media (max-width: 480px) {
    .page {
      padding-top: 20px;
      padding-bottom: 32px;
    }

    .page-title {
      font-size: 30px;
      line-height: 1.25;
    }

    .page-subtitle { font-size: 12px; }

    .steps {
      padding: 14px 10px;
      border-radius: 12px;
    }

    .step { gap: 6px; }

    .step-circle {
      width: 24px;
      height: 24px;
      min-width: 24px;
    }

    .step.active .step-label { font-size: 10px; }

    .step-line {
      min-width: 8px;
      margin: 0 5px;
    }

    .card {
      padding: 20px 16px;
      border-radius: 18px;
    }

    .card-title {
      font-size: 24px;
    }

    .card-form {
      grid-template-columns: minmax(0, 1fr);
      gap: 18px;
      padding: 0;
    }

    .pay-option {
      gap: 10px;
      padding: 16px 12px;
      font-size: 12px;
    }

    .safe {
      align-items: flex-start;
      padding: 18px 16px;
    }
  }
`;

/* =====================================================
   PART 2: DATA AND SETTINGS
   ===================================================== */

// Checkout progress steps. This page is step 3.
const STEPS = [
  "Your bag",
  "Billing & shipping",
  "Payment",
  "Order review",
  "Confirmation",
];
const CURRENT_STEP = 3;

// Products shown in OrderSummary (same list as the billing page).
const ITEMS = [
  { id: 1, name: "Botanical Dew Serum", detail: "30 ml", qty: 1, price: 48, color: "#c9955c" },
  { id: 2, name: "Cloud Soft Moisturiser", detail: "50 ml", qty: 1, price: 42, color: "#e3cdb0" },
  { id: 3, name: "Petal Lip Tint", detail: "Rosewood · 4 g", qty: 2, price: 24, color: "#a8576d" },
];

// The three ways to pay. "brand" is the bold text on the right.
const PAYMENT_METHODS = [
  { id: "card", label: "Credit or debit card", brand: "VISA  /  Mastercard" },
  { id: "paypal", label: "PayPal", brand: "PayPal" },
  { id: "applepay", label: "Apple Pay", brand: "Apple Pay" },
];

// Used only when you open /payment directly (no data from the billing page).
const FALLBACK_DATA = {
  form: {
    firstName: "Emma",
    lastName: "Laurent",
    email: "emma.laurent@gmail.com",
    phone: "+44 7700 900 128",
    street: "24 Willow Lane",
    apartment: "Flat 2",
    city: "London",
    postcode: "SW6 2AB",
    country: "United Kingdom",
  },
  billing: {
    firstName: "Emma",
    lastName: "Laurent",
    street: "24 Willow Lane",
    apartment: "Flat 2",
    city: "London",
    postcode: "SW6 2AB",
    country: "United Kingdom",
  },
  sameAddress: true,
  delivery: { id: "standard", title: "Standard delivery", time: "3–5 business days", price: 0 },
  giftNote: "",
};

const EMPTY_CARD = { name: "", number: "", expiry: "", cvc: "" };

/* =====================================================
   PART 3: HELPERS
   ===================================================== */

// "4242424242424242" -> "4242 4242 4242 4242" (digits only, max 19)
function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

// "0829" -> "08 / 29"
function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

// First digits decide the brand (simple version)
function getCardBrand(number) {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("4")) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  return "Card";
}

// Returns an object like { number: "message" }. Empty object = all good.
function validateCard(card) {
  const errors = {};

  if (!card.name.trim()) {
    errors.name = "Please enter the cardholder name.";
  }

  const numberDigits = card.number.replace(/\D/g, "");
  if (numberDigits.length < 13 || numberDigits.length > 19) {
    errors.number = "Please enter a valid card number.";
  }

  const expiryDigits = card.expiry.replace(/\D/g, "");
  if (expiryDigits.length !== 4) {
    errors.expiry = "Use the format MM / YY.";
  } else {
    const month = Number(expiryDigits.slice(0, 2));
    const year = 2000 + Number(expiryDigits.slice(2));
    const now = new Date();
    const isExpired =
      year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1);

    if (month < 1 || month > 12) {
      errors.expiry = "Month must be between 01 and 12.";
    } else if (isExpired) {
      errors.expiry = "This card has expired.";
    }
  }

  if (!/^\d{3,4}$/.test(card.cvc)) {
    errors.cvc = "Enter the 3 or 4 digit code.";
  }

  return errors;
}

// Address helpers for the "Your billing details" and "Delivery" boxes
function getFullName(address) {
  return `${address.firstName} ${address.lastName}`.trim();
}

function getStreetLine(address) {
  return [address.street, address.apartment].filter(Boolean).join(", ");
}

function getCityLine(address) {
  return [`${address.city || ""} ${address.postcode || ""}`.trim(), address.country]
    .filter(Boolean)
    .join(", ");
}

function formatPrice(price) {
  return price === 0 ? "Complimentary" : `$${price.toFixed(2)}`;
}

/* =====================================================
   PART 4: SMALL REUSABLE COMPONENTS
   ===================================================== */

// A label + input, with optional icon on the right and an error message
function Field({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  full = false,
  error = "",
  icon = null,
  inputMode,
  autoComplete = "off",
}) {
  return (
    <div className={full ? "field full" : "field"}>
      <label htmlFor={name}>{label}</label>

      <div className="input-wrap">
        <input
          className={`input${icon ? " has-icon" : ""}${error ? " invalid" : ""}`}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
        />
        {icon && <span className="input-icon">{icon}</span>}
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

// A custom-styled checkbox with text next to it
function Checkbox({ checked, onChange, children }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="check-box">
        <Check size={12} strokeWidth={3} />
      </span>
      {children}
    </label>
  );
}

// One row: radio + name + brand text
function PaymentOption({ method, isSelected, onSelect }) {
  return (
    <label className={isSelected ? "pay-option selected" : "pay-option"}>
      <input
        type="radio"
        name="payment-method"
        value={method.id}
        checked={isSelected}
        onChange={() => onSelect(method.id)}
      />
      <span className="radio" />
      <span className="pay-name">{method.label}</span>
      <span className="pay-brand">{method.brand}</span>
    </label>
  );
}

/* =====================================================
   PART 5: SECTIONS OF THE PAGE
   ===================================================== */

function Breadcrumb() {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      <ChevronRight size={12} />
      <span className="current">Checkout</span>
    </nav>
  );
}

function StepsBar() {
  return (
    <div className="steps">
      {STEPS.map((label, index) => {
        const number = index + 1;
        const isDone = number < CURRENT_STEP;
        const isActive = number === CURRENT_STEP;
        const status = isDone ? "done" : isActive ? "active" : "";

        return (
          <React.Fragment key={label}>
            <div className={`step ${status}`}>
              <span className="step-circle">
                {isDone ? <Check size={14} strokeWidth={3} /> : number}
              </span>
              <span className="step-label">{label}</span>
            </div>

            {number < STEPS.length && <span className="step-line" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// The card number / expiry / security code form
function CardForm({ card, errors, onChange, saveCard, onSaveCardChange }) {
  return (
    <>
      <div className="card-form">
        <Field
          full
          label="Cardholder name *"
          name="name"
          placeholder="Name on card"
          autoComplete="cc-name"
          value={card.name}
          onChange={onChange}
          error={errors.name}
        />

        <Field
          full
          label="Card number *"
          name="number"
          placeholder="1234 5678 9012 3456"
          inputMode="numeric"
          autoComplete="cc-number"
          value={card.number}
          onChange={onChange}
          error={errors.number}
          icon={<CreditCard size={16} />}
        />

        <Field
          label="Expiry date *"
          name="expiry"
          placeholder="MM / YY"
          inputMode="numeric"
          autoComplete="cc-exp"
          value={card.expiry}
          onChange={onChange}
          error={errors.expiry}
        />

        <Field
          label="Security code *"
          name="cvc"
          type="password"
          placeholder="•••"
          inputMode="numeric"
          autoComplete="cc-csc"
          value={card.cvc}
          onChange={onChange}
          error={errors.cvc}
          icon={<HelpCircle size={16} />}
        />
      </div>

      <div style={{ padding: "0 14px", marginBottom: 20 }}>
        <Checkbox checked={saveCard} onChange={onSaveCardChange}>
          Save this card securely for my next visit (optional)
        </Checkbox>
      </div>
    </>
  );
}

function PaymentCard({
  method,
  onMethodChange,
  card,
  errors,
  onCardChange,
  saveCard,
  onSaveCardChange,
}) {
  return (
    <section className="card">
      <h2 className="card-title">Payment method</h2>
      <p className="card-note">All transactions are secure and encrypted.</p>

      {PAYMENT_METHODS.map((option) => (
        <React.Fragment key={option.id}>
          <PaymentOption
            method={option}
            isSelected={method === option.id}
            onSelect={onMethodChange}
          />

          {/* The card form opens right under the card option */}
          {option.id === "card" && method === "card" && (
            <CardForm
              card={card}
              errors={errors}
              onChange={onCardChange}
              saveCard={saveCard}
              onSaveCardChange={(e) => onSaveCardChange(e.target.checked)}
            />
          )}
        </React.Fragment>
      ))}

      <p className="pay-footnote">
        For PayPal or Apple Pay, you’ll securely authorise payment after reviewing your order.
      </p>
    </section>
  );
}

function BillingDetailsCard({ billing, sameAddress }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">Your billing details</h2>
        <Link to="/billingshipping" className="edit-link">Edit</Link>
      </div>

      <p className="billing-name">{getFullName(billing)}</p>

      <p className="billing-address">
        {getStreetLine(billing)}
        <br />
        {getCityLine(billing)}
      </p>

      {sameAddress && (
        <p className="same-note">
          <Check size={14} />
          Same as shipping address
        </p>
      )}
    </section>
  );
}

function SafeCheckoutBanner() {
  return (
    <div className="safe">
      <ShieldCheck size={22} />
      <div>
        <h3>A safe, considered checkout</h3>
        <p>Your card will only be charged when you place your order in the next step.</p>
      </div>
    </div>
  );
}

function HelpBox() {
  return (
    <div className="help">
      <h3>A little help from the atelier?</h3>
      <p>Our team is here to make your ritual effortless.</p>
      <a href="mailto:hello@maisonbeaute.com">hello@maisonbeaute.com</a>
    </div>
  );
}

function DeliveryBox({ delivery, shipping }) {
  return (
    <div className="delivery-box">
      <div className="card-header">
        <h3>Delivery</h3>
        <Link to="/billingshipping" className="edit-link">Edit</Link>
      </div>

      <p className="delivery-line">
        {delivery.title} · {formatPrice(delivery.price)}
      </p>
      <p className="delivery-line">{delivery.time}</p>

      <p className="delivery-to">
        To {getFullName(shipping)} · {shipping.city} {shipping.postcode}
      </p>
    </div>
  );
}

/* =====================================================
   PART 6: THE PAGE
   ===================================================== */

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  // Data sent from the billing page (or sample data if opened directly)
  const previous = location.state || FALLBACK_DATA;
  const { form: shipping, billing, sameAddress, delivery } = previous;

  // ----- State (what the page remembers) -----
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState(EMPTY_CARD);
  const [errors, setErrors] = useState({});
  const [saveCard, setSaveCard] = useState(false);

  // ----- Update one card field (and format it while typing) -----
  function handleCardChange(e) {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "number") newValue = formatCardNumber(value);
    if (name === "expiry") newValue = formatExpiry(value);
    if (name === "cvc") newValue = value.replace(/\D/g, "").slice(0, 4);

    setCard((old) => ({ ...old, [name]: newValue }));

    // Remove the error of this field once the user types again
    if (errors[name]) {
      setErrors((old) => ({ ...old, [name]: "" }));
    }
  }

  // ----- Validate, then go to the order review page -----
  function handleContinue() {
    if (method === "card") {
      const newErrors = validateCard(card);
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) return;
    }

    // Never pass the full card number or security code to the next page.
    // Only keep what the review page needs to show.
    const data = {
      ...previous,
      payment: {
        method,
        saveCard,
        cardLast4: method === "card" ? card.number.replace(/\D/g, "").slice(-4) : "",
        cardBrand: method === "card" ? getCardBrand(card.number) : "",
        cardName: method === "card" ? card.name.trim() : "",
        cardExpiry: method === "card" ? card.expiry : "",
      },
    };

    navigate("/orderreview", { state: data });
  }

  // ----- What the user sees -----
  return (
    <>
      <style>{styles}</style>

      <div className="page">
        <Breadcrumb />

        <h1 className="page-title">The finishing touch</h1>
        <p className="page-subtitle">
          Choose how you’d like to pay. Your details are handled with care, always.
        </p>

        <StepsBar />

        <div className="layout">
          {/* LEFT COLUMN */}
          <div className="main">
            <PaymentCard
              method={method}
              onMethodChange={setMethod}
              card={card}
              errors={errors}
              onCardChange={handleCardChange}
              saveCard={saveCard}
              onSaveCardChange={setSaveCard}
            />

            <BillingDetailsCard billing={billing} sameAddress={sameAddress} />

            <SafeCheckoutBanner />

            <Link to="/billingshipping" className="back-link">
              <ArrowLeft size={14} />
              Back to billing &amp; shipping
            </Link>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="sidebar">
            <OrderSummary
              items={ITEMS}
              deliveryFee={delivery.price}
              buttonLabel="Continue to order review"
              onContinue={handleContinue}
            />

            <HelpBox />

            <DeliveryBox delivery={delivery} shipping={shipping} />
          </aside>
        </div>
      </div>
    </>
  );
}

export default Payment;