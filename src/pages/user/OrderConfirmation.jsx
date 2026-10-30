import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Check,
  ChevronRight,
  ArrowRight,
  MailCheck,
  Package,
  Truck,
} from "lucide-react";

import OrderSummary from "../../components/OrderSummary";
import useInvoice from "../../hooks/useInvoice";

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

  .card-footnote {
    margin: 0;
    font-size: 11px;
    line-height: 1.6;
    color: #8a7a70;
  }

  /* ----- Confirmation hero (beige box) ----- */

  .hero {
    padding: 28px;
    background: #e9dccb;
    border-radius: 24px;
    min-width: 0;
  }

  .hero-top {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 36px;
  }

  .hero-icon {
    width: 56px;
    height: 56px;
    min-width: 56px;
    border-radius: 50%;
    background: #fffdfa;
    color: #8b4a5e;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-title {
    margin: 0 0 6px;
    font-family: Georgia, serif;
    font-size: 30px;
    line-height: 1.3;
    font-weight: normal;
  }

  .hero-text {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
  }

  .hero-meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    margin-bottom: 28px;
  }

  .hero-value {
    margin: 0;
    font-size: 17px;
    overflow-wrap: anywhere;
  }

  .hero .card-footnote {
    font-size: 12px;
    overflow-wrap: anywhere;
  }

  /* ----- Two-column info blocks ----- */

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .info-label {
    margin: 0 0 12px;
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #8b4a5e;
  }

  .address-line {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  .phone-line {
    margin: 20px 0 0;
    font-size: 11px;
    color: #8a7a70;
  }

  .delivery-date {
    margin: 0 0 14px;
    font-family: Georgia, serif;
    font-size: 28px;
    line-height: 1.3;
  }

  .small-muted {
    margin: 0 0 4px;
    font-size: 12px;
    line-height: 1.6;
    color: #8a7a70;
  }

  .small-muted.spaced { margin-top: 14px; }

  /* ----- What happens next ----- */

  .next-list {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .next-item {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .icon-circle {
    width: 40px;
    height: 40px;
    min-width: 40px;
    border-radius: 50%;
    background: #f5ede6;
    color: #8b4a5e;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .next-title {
    margin: 0 0 4px;
    font-family: Georgia, serif;
    font-size: 20px;
    font-weight: normal;
  }

  .next-text {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    color: #8a7a70;
  }

  /* ----- Buttons ----- */

  .actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .btn-primary,
  .btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px 28px;
    border-radius: 999px;
    font-size: 13px;
    text-decoration: none;
    cursor: pointer;
  }

  .btn-primary {
    border: none;
    background: #8b4a5e;
    color: white;
  }
  .btn-primary:hover { background: #763d4e; }

  .btn-outline {
    border: 1px solid #eadfd6;
    background: #fffdfa;
    color: #3d3530;
  }
  .btn-outline:hover { background: #f5ede6; }

  .btn-full { width: 100%; }

  .change-note {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    color: #8a7a70;
  }

  /* ----- Paid note (under the order card) ----- */

  .paid-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 0;
    font-size: 11px;
    color: #8a7a70;
  }

  .paid-note svg { color: #8b4a5e; }

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

  /* ----- Account box ----- */

  .account-text {
    margin: 0 0 24px;
    font-size: 12px;
    line-height: 1.7;
    color: #8a7a70;
  }

  .account-hint {
    margin: 22px 0 0;
    font-size: 11px;
    color: #8a7a70;
    overflow-wrap: anywhere;
  }

  /* ----- OrderSummary tweaks for THIS page only -----
     OrderSummary.jsx is not changed. We hide and relabel parts with CSS. */

  /* No button and no "Secure checkout" line */
  .confirm-summary .order-button,
  .confirm-summary .secure {
    display: none;
  }

  /* Without the button, remove the empty space under the total */
  .confirm-summary .total {
    margin-bottom: 0;
  }

  /* Title: "Order summary" -> "Your order" */
  .confirm-summary .order-title {
    font-size: 0;
  }
  .confirm-summary .order-title::after {
    content: "Your order";
    font-size: 26px;
  }

  /* Total label: "Total" -> "Total paid" */
  .confirm-summary .total span:first-child {
    font-size: 0;
  }
  .confirm-summary .total span:first-child::after {
    content: "Total paid";
    font-size: 26px;
  }

  /* Delivery label: "Standard delivery" -> the delivery the customer chose */
  .confirm-summary .line + .row + .row span:first-child {
    font-size: 0;
  }
  .confirm-summary .line + .row + .row span:first-child::after {
    content: var(--delivery-label);
    font-size: 14px;
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

    .card,
    .hero {
      padding: 20px 16px;
      border-radius: 18px;
    }

    .card-title { font-size: 24px; }
    .hero-title { font-size: 24px; }

    .hero-meta,
    .info-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
    }

    .actions { flex-direction: column; }
    .actions .btn-primary,
    .actions .btn-outline { width: 100%; }
  }
`;

/* =====================================================
   PART 2: DATA AND SETTINGS
   ===================================================== */

// Checkout progress steps. This page is step 5 (the last one).
const STEPS = [
  "Your bag",
  "Billing & shipping",
  "Payment",
  "Order review",
  "Confirmation",
];
const CURRENT_STEP = 5;

// Products now come from the review page (the order that was placed).

// The three "What happens next?" steps
const NEXT_STEPS = [
  {
    id: "inbox",
    icon: MailCheck,
    title: "A note in your inbox",
    text: "Your order details and receipt are ready to keep.",
  },
  {
    id: "wrapped",
    icon: Package,
    title: "Wrapped with care",
    text: "Our atelier is preparing your essentials in recyclable packaging.",
  },
  {
    id: "way",
    icon: Truck,
    title: "On its way to you",
    text: "Your dispatch email will include a link to track your delivery.",
  },
];

// Names shown for the payment methods that are not a card
const PAYMENT_LABELS = {
  paypal: "PayPal",
  applepay: "Apple Pay",
};

// Used only when you open /orderconfirmation directly (no data from the review page).
const SAMPLE_ADDRESS = {
  firstName: "Emma",
  lastName: "Laurent",
  street: "24 Willow Lane",
  apartment: "Flat 2",
  city: "London",
  postcode: "SW6 2AB",
  country: "United Kingdom",
};

const FALLBACK_DATA = {
  form: {
    ...SAMPLE_ADDRESS,
    email: "emma.laurent@gmail.com",
    phone: "+44 7700 900 128",
  },
  billing: SAMPLE_ADDRESS,
  sameAddress: true,
  delivery: { id: "standard", title: "Standard delivery", time: "3–5 business days", price: 0 },
  giftNote: "",
  payment: {
    method: "card",
    cardBrand: "Visa",
    cardLast4: "4242",
  },
  items: [],
  total: 0,
  orderNumber: "INV-00000000-00000",
};

/* =====================================================
   PART 3: HELPERS
   ===================================================== */

// 48 becomes "$48.00"
function formatMoney(number) {
  return "$" + number.toFixed(2);
}

// 0 becomes "Complimentary", 12 becomes "$12.00"
function formatDeliveryPrice(price) {
  return price === 0 ? "Complimentary" : formatMoney(price);
}

// Adds up price x quantity for all products
function getSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// Date -> "5 October 2026"
function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Adds working days (Monday to Friday) to a date
function addBusinessDays(startDate, days) {
  const date = new Date(startDate);
  let added = 0;

  while (added < days) {
    date.setDate(date.getDate() + 1);
    const weekday = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (weekday !== 0 && weekday !== 6) added++;
  }

  return date;
}

// "3–5 business days" + order date -> "9–13 October 2026"
function getDeliveryWindow(timeText, orderDate) {
  const numbers = timeText.match(/\d+/g);
  if (!numbers) return timeText;

  const from = addBusinessDays(orderDate, Number(numbers[0]));
  const to = addBusinessDays(orderDate, Number(numbers[numbers.length - 1]));

  const sameMonth =
    from.getMonth() === to.getMonth() &&
    from.getFullYear() === to.getFullYear();

  if (sameMonth) {
    const month = to.toLocaleDateString("en-GB", { month: "long" });
    return `${from.getDate()}–${to.getDate()} ${month} ${to.getFullYear()}`;
  }

  return `${formatDate(from)} – ${formatDate(to)}`;
}

function getFullName(address) {
  return `${address.firstName} ${address.lastName}`.trim();
}

// Returns the address as a list of lines, without empty ones
function getAddressLines(address) {
  return [
    getFullName(address),
    [address.street, address.apartment].filter(Boolean).join(", "),
    `${address.city || ""} ${address.postcode || ""}`.trim(),
    address.country,
  ].filter(Boolean);
}

// One short line, used when billing is a different address
function getOneLineAddress(address) {
  return [address.street, `${address.city || ""} ${address.postcode || ""}`.trim()]
    .filter(Boolean)
    .join(", ");
}

// "Visa •••• 4242" or "PayPal"
function getPaymentText(payment) {
  if (payment.method === "card") {
    return `${payment.cardBrand || "Card"} •••• ${payment.cardLast4}`;
  }
  return PAYMENT_LABELS[payment.method] || "your chosen method";
}

/* =====================================================
   PART 4: SECTIONS OF THE PAGE
   ===================================================== */

function Breadcrumb() {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      <ChevronRight size={12} />
      <span className="current">Order confirmation</span>
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

// The beige box at the top: order number, date, email note
function ConfirmationHero({ total, orderNumber, placedOn, email }) {
  return (
    <section className="hero">
      <div className="hero-top">
        <span className="hero-icon">
          <Check size={26} />
        </span>

        <div>
          <h2 className="hero-title">Beautiful things are coming</h2>
          <p className="hero-text">
            Your payment of {formatMoney(total)} was successful.
          </p>
        </div>
      </div>

      <div className="hero-meta">
        <div>
          <p className="info-label" style={{ marginBottom: 8 }}>Order number</p>
          <p className="hero-value">{orderNumber}</p>
        </div>

        <div>
          <p className="info-label" style={{ marginBottom: 8 }}>Placed on</p>
          <p className="hero-value" style={{ fontSize: 14 }}>{placedOn}</p>
        </div>
      </div>

      <p className="card-footnote">
        Your confirmation and receipt have been sent to {email}.
      </p>
    </section>
  );
}

function DeliveryBillingCard({ shipping, billing, sameAddress, delivery, giftNote, placedDate }) {
  return (
    <section className="card">
      <h2 className="card-title">Delivery &amp; billing</h2>

      <div className="info-grid">
        {/* Left: shipping address */}
        <div>
          <p className="info-label">Shipping address</p>

          {getAddressLines(shipping).map((line) => (
            <p className="address-line" key={line}>{line}</p>
          ))}

          <p className="phone-line">Phone: {shipping.phone}</p>
        </div>

        {/* Right: delivery date and notes */}
        <div>
          <p className="info-label">{delivery.title}</p>

          <p className="delivery-date">
            {getDeliveryWindow(delivery.time, placedDate)}
          </p>

          <p className="small-muted">
            {formatDeliveryPrice(delivery.price)} · {delivery.time}
          </p>
          <p className="small-muted">We’ll email you when your parcel leaves.</p>

          <p className="small-muted spaced">
            Billing address:{" "}
            {sameAddress ? "same as shipping." : `${getOneLineAddress(billing)}.`}
          </p>
          <p className="small-muted">
            {giftNote ? "Gift note added." : "No gift note added."}
          </p>
        </div>
      </div>
    </section>
  );
}

function NextStepsCard() {
  return (
    <section className="card">
      <h2 className="card-title" style={{ marginBottom: 20 }}>What happens next?</h2>

      <div className="next-list">
        {NEXT_STEPS.map((step) => {
          const Icon = step.icon;

          return (
            <div className="next-item" key={step.id}>
              <span className="icon-circle">
                <Icon size={18} />
              </span>

              <div>
                <h3 className="next-title">{step.title}</h3>
                <p className="next-text">{step.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PaidNote({ payment }) {
  return (
    <p className="paid-note">
      <Check size={14} />
      Paid securely with {getPaymentText(payment)}
    </p>
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

function AccountCard({ email }) {
  return (
    <section className="card">
      <h2 className="card-title" style={{ marginBottom: 20 }}>Make yourself at home</h2>

      <p className="account-text">
        Create an account to keep your rituals, find your receipts and make your next visit effortless.
      </p>

      <Link to="/register" className="btn-outline btn-full">
        Create an account
      </Link>

      <p className="account-hint">Use {email} to get started.</p>
    </section>
  );
}

/* =====================================================
   PART 5: THE PAGE
   ===================================================== */

function OrderConfirmation() {
  const location = useLocation();

  // Order sent from the review page (or sample data if opened directly)
    const order = location.state || FALLBACK_DATA;
  const { form: shipping, billing, sameAddress, delivery, giftNote, payment } = order;

    // A new order brings its invoice from the review page.
  // If the page is opened directly, we load the demo invoice from invoices.json.
  const {
    invoice: demoInvoice,
    items: demoItems,
    loading: demoLoading,
  } = useInvoice(101);

  const invoice = order.invoice || demoInvoice;
  const items = order.invoice ? order.items : demoItems;
  const loading = order.invoice ? false : demoLoading;

  const orderNumber = invoice ? invoice.invoiceNumber : "";
  const total = invoice ? invoice.total : 0;
  const placedDate = invoice ? new Date(invoice.createdAt) : new Date();

  if (loading) {
    return <p style={{ padding: 40, textAlign: "center" }}>Loading your invoice…</p>;
  }

  // "Download receipt" opens the browser print window (Save as PDF works there).
  // TODO: replace with a real receipt file from your Laravel API.
  function handleDownloadReceipt() {
    window.print();
  }

  return (
    <>
      <style>{styles}</style>

      <div className="page">
        <Breadcrumb />

        <h1 className="page-title">Thank you, {shipping.firstName}</h1>
        <p className="page-subtitle">
          Your order is confirmed. A little everyday beauty is on its way.
        </p>

        <StepsBar />

        <div className="layout">
          {/* LEFT COLUMN */}
          <div className="main">
            <ConfirmationHero
              total={total}
              orderNumber={orderNumber}
              placedOn={formatDate(placedDate)}
              email={shipping.email}
            />

            <DeliveryBillingCard
              shipping={shipping}
              billing={billing}
              sameAddress={sameAddress}
              delivery={delivery}
              giftNote={giftNote}
              placedDate={placedDate}
            />

            <NextStepsCard />

            <div className="actions">
              <Link to="/products" className="btn-primary">
                Continue shopping
                <ArrowRight size={16} />
              </Link>

              <button type="button" className="btn-outline" onClick={handleDownloadReceipt}>
                Download receipt
              </button>
            </div>

            <p className="change-note">
              Need to change something? Contact us with order number {orderNumber} before dispatch.
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="sidebar">
            {/* OrderSummary is used as it is. The wrapper class only changes
                how it looks on this page (see ".confirm-summary" in the CSS). */}
            <div
              className="confirm-summary"
              style={{ "--delivery-label": JSON.stringify(delivery.title) }}
            >
            <OrderSummary items={items} deliveryFee={invoice?.deliveryFee || 0} />
            </div>

            <PaidNote payment={payment} />

            <HelpBox />

            <AccountCard email={shipping.email} />
          </aside>
        </div>
      </div>
    </>
  );
}

export default OrderConfirmation;