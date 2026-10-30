import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Check, ChevronRight, ArrowLeft, Truck } from "lucide-react";

import OrderSummary from "../../components/OrderSummary";
import useCartItems from "../../hooks/useCartItems";

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
    margin: 0;
    font-family: Georgia, serif;
    font-size: 28px;
    line-height: 1.3;
    font-weight: normal;
  }

  .edit-link {
    font-size: 12px;
    color: #8b4a5e;
    text-decoration: none;
  }
  .edit-link:hover { text-decoration: underline; }

  .card-footnote {
    margin: 24px 0 0;
    font-size: 11px;
    line-height: 1.6;
    color: #8a7a70;
  }

  /* ----- Two-column info blocks (contact, ship to / bill to) ----- */

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

  .info-text {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  .info-text.muted {
    color: #8a7a70;
  }

  .address-line {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  /* ----- Delivery row ----- */

  .row-with-icon {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .icon-circle {
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 50%;
    background: #f5ede6;
    color: #8b4a5e;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .row-title {
    margin: 0 0 4px;
    font-size: 13px;
    line-height: 1.5;
  }

  .row-sub {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: #8a7a70;
  }

  /* ----- Payment row ----- */

  .brand-box {
    min-width: 60px;
    height: 40px;
    padding: 0 14px;
    border-radius: 6px;
    background: #f5ede6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: bold;
    font-style: italic;
    letter-spacing: 0.02em;
    color: #3d3530;
    flex-shrink: 0;
  }

  /* ----- Bottom links ----- */

  .bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #8b4a5e;
    text-decoration: none;
  }

  .back-link:hover { text-decoration: underline; }

  /* ----- Terms note (under the order summary) ----- */

  .terms {
    margin: 0;
    padding: 0 4px;
    font-size: 11px;
    line-height: 1.6;
    color: #8a7a70;
  }

  .terms a {
    color: #8b4a5e;
    text-decoration: none;
  }

  .terms a:hover { text-decoration: underline; }

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

    .card-title { font-size: 24px; }

    .info-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
    }
  }
`;

/* =====================================================
   PART 2: DATA AND SETTINGS
   ===================================================== */

// Checkout progress steps. This page is step 4.
const STEPS = [
  "Your bag",
  "Billing & shipping",
  "Payment",
  "Order review",
  "Confirmation",
];
const CURRENT_STEP = 4;

// Products now come from the previous page (or from the JSON files).
// See hooks/useCartItems.js.

// Names shown for the payment methods that are not a card
const PAYMENT_LABELS = {
  paypal: "PayPal",
  applepay: "Apple Pay",
};

// Used only when you open /orderreview directly (no data from the payment page).
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
    cardName: "Emma Laurent",
    cardExpiry: "08 / 29",
  },
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

function getFullName(address) {
  return `${address.firstName} ${address.lastName}`.trim();
}

// Returns the address as a list of lines, without empty ones:
// ["Emma Laurent", "24 Willow Lane, Flat 2", "London SW6 2AB", "United Kingdom"]
function getAddressLines(address) {
  return [
    getFullName(address),
    [address.street, address.apartment].filter(Boolean).join(", "),
    `${address.city || ""} ${address.postcode || ""}`.trim(),
    address.country,
  ].filter(Boolean);
}

/* =====================================================
   PART 4: SMALL REUSABLE COMPONENTS
   ===================================================== */

// Card with a title and an "Edit" link on the right
function ReviewCard({ title, editTo, children }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
        <Link to={editTo} className="edit-link">Edit</Link>
      </div>
      {children}
    </section>
  );
}

// Shows an address, one line under the other
function AddressBlock({ label, address }) {
  return (
    <div>
      <p className="info-label">{label}</p>
      {getAddressLines(address).map((line) => (
        <p className="address-line" key={line}>{line}</p>
      ))}
    </div>
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

function ContactCard({ shipping }) {
  return (
    <ReviewCard title="Contact details" editTo="/billingshipping">
      <div className="info-grid">
        <div>
          <p className="info-text">{getFullName(shipping)}</p>
          <p className="info-text muted" style={{ marginTop: 8 }}>
            {shipping.email}
          </p>
        </div>

        <div>
          <p className="info-label" style={{ marginBottom: 8 }}>Phone number</p>
          <p className="info-text">{shipping.phone}</p>
        </div>
      </div>
    </ReviewCard>
  );
}

function BillingShippingCard({ shipping, billing, sameAddress }) {
  return (
    <ReviewCard title="Billing & shipping" editTo="/billingshipping">
      <div className="info-grid">
        <AddressBlock label="Ship to" address={shipping} />
        <AddressBlock label="Bill to" address={billing} />
      </div>

      {sameAddress && (
        <p className="card-footnote">Billing address is the same as shipping.</p>
      )}
    </ReviewCard>
  );
}

function DeliveryCard({ delivery, giftNote }) {
  return (
    <ReviewCard title="Delivery details" editTo="/billingshipping">
      <div className="row-with-icon">
        <span className="icon-circle">
          <Truck size={20} />
        </span>

        <div>
          <p className="row-title">
            {delivery.title} · {formatDeliveryPrice(delivery.price)}
          </p>
          <p className="row-sub">{delivery.time}</p>
        </div>
      </div>

      <p className="card-footnote">
        Recyclable packaging · {giftNote ? "Gift note added" : "No gift note added"}
      </p>
    </ReviewCard>
  );
}

function PaymentCard({ payment, total }) {
  const isCard = payment.method === "card";

  return (
    <ReviewCard title="Payment" editTo="/payment">
      {isCard ? (
        <div className="row-with-icon">
          <span className="brand-box">
            {(payment.cardBrand || "Card").toUpperCase()}
          </span>

          <div>
            <p className="row-title">
              {payment.cardBrand || "Card"} ending in {payment.cardLast4}
            </p>
            <p className="row-sub">
              {payment.cardName} · Expires {payment.cardExpiry}
            </p>
          </div>
        </div>
      ) : (
        <div className="row-with-icon">
          <span className="brand-box">{PAYMENT_LABELS[payment.method]}</span>

          <div>
            <p className="row-title">{PAYMENT_LABELS[payment.method]}</p>
            <p className="row-sub">You will authorise the payment after placing your order.</p>
          </div>
        </div>
      )}

      <p className="card-footnote">
        {formatMoney(total)} will be charged when you place your order.
      </p>
    </ReviewCard>
  );
}

function TermsNote() {
  return (
    <p className="terms">
      By placing your order, you agree to our{" "}
      <a href="/terms">Terms &amp; Conditions</a> and{" "}
      <a href="/privacy">Privacy Policy</a>.
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

/* =====================================================
   PART 6: THE PAGE
   ===================================================== */

function OrderReview() {
  const navigate = useNavigate();
  const location = useLocation();

  // Data sent from the payment page (or sample data if opened directly)
  const previous = location.state || FALLBACK_DATA;
  const { form: shipping, billing, sameAddress, delivery, giftNote, payment } = previous;

  // Items come from the previous page. If you open this page directly,
  // we load the default cart from the JSON files.
  const { items: loadedItems } = useCartItems(101);
  const items = previous.items || loadedItems;

  // Stops a double click from placing the order twice
  const [isPlacing, setIsPlacing] = useState(false);

  // ----- Values worked out from the data -----
  const total = getSubtotal(items) + delivery.price;

  // ----- Place the order, then go to the confirmation page -----
  function handlePlaceOrder() {
  if (isPlacing) return;
  setIsPlacing(true);

  // The invoice itself is read from invoices.json on the confirmation page.
  // TODO: send the order to your Laravel API here.
  navigate("/orderconfirmation", { state: { ...previous, items, total } });
}

  // ----- What the user sees -----
  return (
    <>
      <style>{styles}</style>

      <div className="page">
        <Breadcrumb />

        <h1 className="page-title">One last look at your ritual</h1>
        <p className="page-subtitle">
          Everything, just as you chose. Review your details before placing your order.
        </p>

        <StepsBar />

        <div className="layout">
          {/* LEFT COLUMN */}
          <div className="main">
            <ContactCard shipping={shipping} />

            <BillingShippingCard
              shipping={shipping}
              billing={billing}
              sameAddress={sameAddress}
            />

            <DeliveryCard delivery={delivery} giftNote={giftNote} />

            <PaymentCard payment={payment} total={total} />

            <div className="bottom-row">
              <Link to="/payment" className="back-link">
                <ArrowLeft size={14} />
                Back to payment
              </Link>

              <Link to="/checkout" className="back-link">
                Edit your bag
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="sidebar">
            <OrderSummary
              items={items}
              deliveryFee={delivery.price}
              buttonLabel={`Place order · ${formatMoney(total)}`}
              onContinue={handlePlaceOrder}
            />

            <TermsNote />

            <HelpBox />
          </aside>
        </div>
      </div>
    </>
  );
}

export default OrderReview;