import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Gift,
  Plus,
  Minus,
  Leaf,
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

  .card-title {
    margin: 0 0 24px;
    font-family: Georgia, serif;
    font-size: 28px;
    line-height: 1.3;
    font-weight: normal;
  }

  /* ----- Form fields ----- */

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 18px;
  }

  .form-grid.spaced { margin-top: 24px; }

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

  .input {
    width: 100%;
    min-width: 0;
    height: 46px;
    padding: 0 14px;
    border: 1px solid #eadfd6;
    border-radius: 10px;
    background: #fffdfa;
    font-size: 13px;
    color: #3d3530;
    outline: none;
    appearance: none;
  }

  .input::placeholder { color: #b9a99e; }

  .input:focus {
    border-color: #8b4a5e;
    box-shadow: 0 0 0 2px rgba(139, 74, 94, 0.08);
  }

  /* ----- Country dropdown ----- */

  .select-wrap { position: relative; }

  .select-wrap svg {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #3d3530;
    pointer-events: none;
  }

  /* ----- Checkbox ----- */

  .check {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
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

  .billing-text {
    margin: 20px 0 0;
    font-size: 12px;
    line-height: 1.8;
    color: #8a7a70;
    overflow-wrap: anywhere;
  }

  .billing-hint {
    margin: 28px 0 0;
    font-size: 11px;
    line-height: 1.6;
    color: #8a7a70;
  }

  /* ----- Delivery options ----- */

  .delivery-option {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 16px;
    margin-bottom: 16px;
    border: 1px solid #eadfd6;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  .delivery-option:last-of-type { margin-bottom: 24px; }

  .delivery-option.selected {
    background: #f3e6ea;
    border-color: #8b4a5e;
  }

  .delivery-option input {
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
  }

  .delivery-option.selected .radio { border-color: #8b4a5e; }

  .delivery-option.selected .radio::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #8b4a5e;
  }

  .delivery-option input:focus-visible + .radio {
    outline: 2px solid #8b4a5e;
    outline-offset: 3px;
  }

  .delivery-info { flex: 1; min-width: 0; }

  .delivery-name {
    margin: 0 0 4px;
    font-size: 13px;
    line-height: 1.5;
  }

  .delivery-time {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    color: #8a7a70;
  }

  .delivery-price {
    font-size: 13px;
    white-space: nowrap;
  }

  .delivery-option.selected .delivery-price { color: #8b4a5e; }

  .eco-note {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin: 0;
    font-size: 11px;
    line-height: 1.7;
    color: #8a7a70;
  }

  .eco-note svg {
    color: #8b4a5e;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* ----- Gift note ----- */

  .gift {
    background: #f5ede6;
    border-radius: 16px;
    overflow: hidden;
  }

  .gift-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px;
    border: none;
    background: none;
    font-size: 13px;
    line-height: 1.5;
    color: #3d3530;
    cursor: pointer;
    text-align: left;
  }

  .gift-header svg:first-child {
    color: #8b4a5e;
    flex-shrink: 0;
  }

  .gift-header .grow { flex: 1; }
  .gift-header svg:last-child { flex-shrink: 0; }

  .gift-header:focus-visible {
    outline: 2px solid #8b4a5e;
    outline-offset: -4px;
  }

  .gift-body { padding: 0 20px 20px; }

  .gift-body textarea {
    width: 100%;
    min-height: 90px;
    padding: 12px 14px;
    border: 1px solid #eadfd6;
    border-radius: 10px;
    background: #fffdfa;
    font-size: 13px;
    line-height: 1.6;
    resize: vertical;
    outline: none;
  }

  .gift-body textarea:focus { border-color: #8b4a5e; }

  .gift-counter {
    margin: 8px 0 0;
    text-align: right;
    font-size: 11px;
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
      margin-bottom: 20px;
    }

    .form-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 18px;
    }

    .full { grid-column: auto; }

    .delivery-option {
      gap: 10px;
      padding: 16px 12px;
    }

    .delivery-name { font-size: 12px; }
    .delivery-time { font-size: 11px; }
    .delivery-price { font-size: 12px; }

    .gift-header {
      gap: 10px;
      padding: 16px;
      font-size: 12px;
    }

    .gift-body { padding: 0 16px 16px; }
  }
`;

/* =====================================================
   PART 2: DATA AND SETTINGS
   ===================================================== */

// Checkout progress steps. This page is step 2.
const STEPS = [
  "Your bag",
  "Billing & shipping",
  "Payment",
  "Order review",
  "Confirmation",
];
const CURRENT_STEP = 2;

// Products shown in OrderSummary.
// OrderSummary reads: id, name, detail, qty, price, color (and image if given).
const ITEMS = [
  { id: 1, name: "Botanical Dew Serum", detail: "30 ml", qty: 1, price: 48, color: "#c9955c" },
  { id: 2, name: "Cloud Soft Moisturiser", detail: "50 ml", qty: 1, price: 42, color: "#e3cdb0" },
  { id: 3, name: "Petal Lip Tint", detail: "Rosewood · 4 g", qty: 2, price: 24, color: "#a8576d" },
];

const DELIVERY_OPTIONS = [
  { id: "standard", title: "Standard delivery", time: "3–5 business days", price: 0 },
  { id: "express", title: "Express delivery", time: "1–2 business days", price: 12 },
];

const COUNTRIES = [
  "United Kingdom",
  "France",
  "Germany",
  "United States",
  "Cambodia",
];

// Required fields: [field name, label used in the error message]
const REQUIRED_SHIPPING_FIELDS = [
  ["email", "Email address"],
  ["phone", "Phone number"],
  ["firstName", "First name"],
  ["lastName", "Last name"],
  ["street", "Street address"],
  ["city", "Town / City"],
  ["postcode", "Postcode"],
  ["country", "Country / Region"],
];

const REQUIRED_BILLING_FIELDS = [
  ["firstName", "Billing first name"],
  ["lastName", "Billing last name"],
  ["street", "Billing street address"],
  ["city", "Billing town / city"],
  ["postcode", "Billing postcode"],
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_BILLING = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  postcode: "",
};

const EMPTY_SHIPPING = {
  ...EMPTY_BILLING,
  email: "",
  phone: "",
  apartment: "",
  country: COUNTRIES[0],
};

/* =====================================================
   PART 3: HELPERS
   ===================================================== */

// A small hook for a form object.
// It returns the values and ONE function that updates any field by its name.
function useFormFields(initialValues) {
  const [values, setValues] = useState(initialValues);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  return [values, handleChange];
}

// Returns the first required field that is empty, or undefined if all are filled.
function findMissingField(values, requiredFields) {
  return requiredFields.find(
    ([name]) => !String(values[name] || "").trim()
  );
}

// Shows the delivery price: 0 becomes "Complimentary", 12 becomes "$12.00"
function formatDeliveryPrice(price) {
  return price === 0 ? "Complimentary" : `$${price.toFixed(2)}`;
}

/* =====================================================
   PART 4: SMALL REUSABLE COMPONENTS
   ===================================================== */

// A label + text input
function Field({ label, name, value, onChange, placeholder = "", type = "text", full = false, prefix = "" }) {
  const id = prefix + name;

  return (
    <div className={full ? "field full" : "field"}>
      <label htmlFor={id}>{label}</label>
      <input
        className="input"
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      />
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

/* =====================================================
   PART 5: SECTIONS OF THE PAGE
   ===================================================== */

function Breadcrumb() {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      <ChevronRight size={12} />
      <span className="current">Billing &amp; shipping</span>
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

function ShippingCard({ form, onChange, saveAddress, onSaveAddressChange }) {
  return (
    <section className="card">
      <h2 className="card-title">Contact &amp; shipping address</h2>

      <div className="form-grid">
        <Field label="Email address *" name="email" type="email" placeholder="name@example.com" value={form.email} onChange={onChange} />
        <Field label="Phone number *" name="phone" type="tel" placeholder="+855 12 345 678" value={form.phone} onChange={onChange} />
        <Field label="First name *" name="firstName" placeholder="First name" value={form.firstName} onChange={onChange} />
        <Field label="Last name *" name="lastName" placeholder="Last name" value={form.lastName} onChange={onChange} />
        <Field full label="Street address *" name="street" placeholder="House number and street name" value={form.street} onChange={onChange} />
        <Field label="Apartment, suite, etc. (optional)" name="apartment" placeholder="Flat, suite, unit" value={form.apartment} onChange={onChange} />
        <Field label="Town / City *" name="city" placeholder="Town or city" value={form.city} onChange={onChange} />
        <Field label="Postcode *" name="postcode" placeholder="Postcode" value={form.postcode} onChange={onChange} />

        {/* Country dropdown */}
        <div className="field">
          <label htmlFor="country">Country / Region *</label>
          <div className="select-wrap">
            <select
              className="input"
              id="country"
              name="country"
              value={form.country}
              onChange={onChange}
            >
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      <Checkbox checked={saveAddress} onChange={onSaveAddressChange}>
        Save this address for my next visit (optional)
      </Checkbox>
    </section>
  );
}

function BillingCard({ sameAddress, onSameAddressChange, shippingSummary, billing, onBillingChange }) {
  return (
    <section className="card">
      <h2 className="card-title">Billing address</h2>

      <Checkbox checked={sameAddress} onChange={onSameAddressChange}>
        Use the same address for billing and shipping
      </Checkbox>

      {sameAddress ? (
        <>
          {shippingSummary && <p className="billing-text">{shippingSummary}</p>}
          <p className="billing-hint">Uncheck to enter a different billing address.</p>
        </>
      ) : (
        <div className="form-grid spaced">
          <Field prefix="billing-" label="First name *" name="firstName" placeholder="First name" value={billing.firstName} onChange={onBillingChange} />
          <Field prefix="billing-" label="Last name *" name="lastName" placeholder="Last name" value={billing.lastName} onChange={onBillingChange} />
          <Field prefix="billing-" full label="Street address *" name="street" placeholder="House number and street name" value={billing.street} onChange={onBillingChange} />
          <Field prefix="billing-" label="Town / City *" name="city" placeholder="Town or city" value={billing.city} onChange={onBillingChange} />
          <Field prefix="billing-" label="Postcode *" name="postcode" placeholder="Postcode" value={billing.postcode} onChange={onBillingChange} />
        </div>
      )}
    </section>
  );
}

function DeliveryCard({ selectedId, onSelect }) {
  return (
    <section className="card">
      <h2 className="card-title">Choose your delivery</h2>

      {DELIVERY_OPTIONS.map((option) => {
        const isSelected = option.id === selectedId;

        return (
          <label
            key={option.id}
            className={isSelected ? "delivery-option selected" : "delivery-option"}
          >
            <input
              type="radio"
              name="delivery"
              value={option.id}
              checked={isSelected}
              onChange={() => onSelect(option.id)}
            />
            <span className="radio" />

            <div className="delivery-info">
              <p className="delivery-name">{option.title}</p>
              <p className="delivery-time">{option.time}</p>
            </div>

            <span className="delivery-price">
              {formatDeliveryPrice(option.price)}
            </span>
          </label>
        );
      })}

      <p className="eco-note">
        <Leaf size={16} />
        <span>
          Carefully wrapped in recyclable packaging. A little kinder to the planet.
        </span>
      </p>
    </section>
  );
}

function GiftNote({ isOpen, onToggle, note, onNoteChange }) {
  return (
    <div className="gift">
      <button
        type="button"
        className="gift-header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <Gift size={18} />
        <span className="grow">Make it a gift · Add a complimentary note</span>
        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
      </button>

      {isOpen && (
        <div className="gift-body">
          <textarea
            placeholder="Write your gift note here..."
            value={note}
            maxLength={500}
            onChange={onNoteChange}
            aria-label="Gift message"
          />
          <p className="gift-counter">{note.length}/500 characters</p>
        </div>
      )}
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

/* =====================================================
   PART 6: THE PAGE
   ===================================================== */

function BillingShipping({ onNext = () => {} }) {
  const navigate = useNavigate();

  // ----- State (what the page remembers) -----
  const [form, handleFormChange] = useFormFields(EMPTY_SHIPPING);
  const [billing, handleBillingChange] = useFormFields(EMPTY_BILLING);

  const [saveAddress, setSaveAddress] = useState(false);
  const [sameAddress, setSameAddress] = useState(true);
  const [deliveryId, setDeliveryId] = useState("standard");
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  // ----- Values worked out from the state -----
  const delivery = DELIVERY_OPTIONS.find((option) => option.id === deliveryId);

  // One-line shipping address shown under "Billing address"
  const shippingSummary = [
    `${form.firstName} ${form.lastName}`.trim(),
    form.street,
    form.apartment,
    `${form.city} ${form.postcode}`.trim(),
    form.country,
  ]
    .filter(Boolean)
    .join(" · ");

  // Only show the summary after the user has started typing an address
  const hasStartedAddress = Boolean(
    form.firstName || form.lastName || form.street || form.city
  );

  // ----- Validate, then go to the payment page -----
  function handleContinue() {
    // 1. Shipping fields
    const missingShipping = findMissingField(form, REQUIRED_SHIPPING_FIELDS);
    if (missingShipping) {
      alert(`Please enter your ${missingShipping[1]}.`);
      return;
    }

    // 2. Email format
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    // 3. Billing fields (only if billing is a different address)
    if (!sameAddress) {
      const missingBilling = findMissingField(billing, REQUIRED_BILLING_FIELDS);
      if (missingBilling) {
        alert(`Please enter your ${missingBilling[1]}.`);
        return;
      }
    }

    // 4. Collect everything for the next page
    const data = {
      form: { ...form },
      billing: sameAddress ? { ...form } : { ...billing },
      sameAddress,
      saveAddress,
      delivery,
      giftNote: giftNote.trim(),
    };

    console.log("Billing & shipping data:", data);

    onNext(data);

    // Send the data to the payment page
    navigate("/payment", { state: data });
  }

  // ----- What the user sees -----
  return (
    <>
      <style>{styles}</style>

      <div className="page">
        <Breadcrumb />

        <h1 className="page-title">From our atelier to your door</h1>
        <p className="page-subtitle">
          Tell us where to send your essentials. All fields marked * are required.
        </p>

        <StepsBar />

        <div className="layout">
          {/* LEFT COLUMN: the forms */}
          <div className="main">
            <ShippingCard
              form={form}
              onChange={handleFormChange}
              saveAddress={saveAddress}
              onSaveAddressChange={(e) => setSaveAddress(e.target.checked)}
            />

            <BillingCard
              sameAddress={sameAddress}
              onSameAddressChange={(e) => setSameAddress(e.target.checked)}
              shippingSummary={hasStartedAddress ? shippingSummary : ""}
              billing={billing}
              onBillingChange={handleBillingChange}
            />

            <DeliveryCard selectedId={deliveryId} onSelect={setDeliveryId} />

            <GiftNote
              isOpen={giftOpen}
              onToggle={() => setGiftOpen((previous) => !previous)}
              note={giftNote}
              onNoteChange={(e) => setGiftNote(e.target.value)}
            />

            <Link to="/checkout" className="back-link">
              <ArrowLeft size={14} />
              Back to your bag
            </Link>
          </div>

          {/* RIGHT COLUMN: summary and help */}
          <aside className="sidebar">
            <OrderSummary
              items={ITEMS}
              deliveryFee={delivery.price}
              buttonLabel="Continue to payment"
              onContinue={handleContinue}
            />

            <HelpBox />
          </aside>
        </div>
      </div>
    </>
  );
}

export default BillingShipping;