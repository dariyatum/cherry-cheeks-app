import { useState } from "react";

const TOPICS = [
  "Order help",
  "Product question",
  "Shade advice",
  "Returns",
  "Press & collaborations",
  "Other",
];

const ADDRESS_QUERY = encodeURIComponent(
  "42 Dosan-daero 45-gil, Gangnam-gu, Seoul",
);

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Inter:wght@400;500;600;700&display=swap');

.contact { background: #faf7f2; color: #2b2420; font-family: 'Inter', sans-serif; text-align: left; }
.contact *, .contact *::before, .contact *::after { box-sizing: border-box; }
.contact .wrap { max-width: 1296px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }

/* Hero */
.contact .hero { padding-top: 72px; padding-bottom: 56px; text-align: center; }
.contact .eyebrow { margin: 0 0 18px; font: 600 11px 'Inter', sans-serif; letter-spacing: 0.2em; text-transform: uppercase; color: #8a3050; }
.contact .hero h1 { margin: 0 0 16px; font: 500 clamp(36px, 5.5vw, 60px)/1.1 'Cormorant Garamond', serif; color: #1a1514; }
.contact .lead { max-width: 580px; margin: 0 auto; font-size: 14px; line-height: 1.7; color: #5f5852; }

/* Two columns */
.contact .body { display: grid; grid-template-columns: minmax(0, 1.13fr) minmax(0, 1fr); gap: 70px; align-items: start; padding-bottom: 72px; }

/* Form card */
.contact .form-card { padding: 36px; border: 1px solid #e8e1d8; border-radius: 32px; background: #fdfbf8; }
.contact .form-card h2 { margin: 0 0 6px; font: 500 32px 'Cormorant Garamond', serif; color: #1a1514; }
.contact .required-note { margin: 0 0 24px; font-size: 12px; color: #5f5852; }
.contact .form { display: grid; gap: 20px; }
.contact .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.contact .field { display: grid; gap: 8px; }
.contact label.lbl { font: 500 11px 'Inter', sans-serif; letter-spacing: 0.08em; text-transform: uppercase; color: #2b2420; }
.contact input[type="text"], .contact input[type="email"], .contact select, .contact textarea {
  width: 100%; padding: 0 16px; height: 50px; border: 1px solid #e2d9cf; border-radius: 10px;
  background: #fdfbf8; color: #2b2420; font: 400 13px 'Inter', sans-serif;
}
.contact textarea { height: 120px; padding-top: 14px; resize: vertical; }
.contact ::placeholder { color: #a39b93; }
.contact select {
  appearance: none; padding-right: 40px;
  background: #fdfbf8 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232b2420' stroke-width='3'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 16px center;
}
.contact select:invalid, .contact select.empty { color: #a39b93; }
.contact input:focus, .contact select:focus, .contact textarea:focus { outline: 2px solid #8a3050; outline-offset: 1px; }
.contact .field.invalid input, .contact .field.invalid select, .contact .field.invalid textarea { border-color: #b3261e; }
.contact .error { font-size: 11px; color: #b3261e; }

.contact .consent { display: flex; align-items: flex-start; gap: 10px; font-size: 11px; line-height: 1.5; color: #5f5852; cursor: pointer; }
.contact .consent input { flex: none; width: 16px; height: 16px; margin: 0; accent-color: #8a3050; }

.contact .send { display: inline-flex; align-items: center; gap: 10px; justify-self: start; padding: 16px 22px; border: none; border-radius: 999px; background: #8a3050; color: #fff; font: 500 13px 'Inter', sans-serif; cursor: pointer; }
.contact .send:hover { opacity: 0.92; }
.contact .send:disabled { opacity: 0.6; cursor: default; }

.contact .success { padding: 8px 0; }
.contact .success h3 { margin: 0 0 8px; font: 500 28px 'Cormorant Garamond', serif; color: #8a3050; }
.contact .success p { margin: 0 0 18px; font-size: 13px; line-height: 1.6; color: #5f5852; }
.contact .again { padding: 0; border: none; background: none; color: #8a3050; font: 600 12px 'Inter', sans-serif; text-decoration: underline; cursor: pointer; }

/* Atelier card */
.contact .atelier { padding: 30px; border-radius: 32px; background: #e8dccd; }
.contact .atelier h2 { margin: 0 0 26px; font: 500 30px 'Cormorant Garamond', serif; color: #1a1514; }
.contact .item { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 22px; }
.contact .circle { flex: none; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: #fdfbf8; }
.contact .item h3 { margin: 2px 0 4px; font: 700 11px 'Inter', sans-serif; letter-spacing: 0.1em; text-transform: uppercase; color: #1a1514; }
.contact .item p, .contact .item a { display: block; margin: 0; font-size: 12px; line-height: 1.6; color: #5f5852; text-decoration: none; }
.contact .item a:hover { color: #8a3050; }
.contact .follow { margin: 28px 0 12px; font: 700 11px 'Inter', sans-serif; letter-spacing: 0.1em; text-transform: uppercase; color: #1a1514; }
.contact .socials { display: flex; gap: 10px; }
.contact .socials a { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: #fdfbf8; }

/* Map */
.contact .map-section { padding-bottom: 96px; }
.contact .map-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 16px; }
.contact .map-head .eyebrow { margin-bottom: 8px; }
.contact .map-head h2 { margin: 0; font: 500 clamp(28px, 4vw, 36px)/1.1 'Cormorant Garamond', serif; color: #1a1514; }
.contact .open-maps { font-size: 11px; color: #8a3050; text-decoration: none; white-space: nowrap; }
.contact .open-maps:hover { text-decoration: underline; }
.contact .map-card { padding: 10px 35px 0; border-radius: 32px; background: #f1ebe3; overflow: hidden; }
.contact .map-title { margin: 0 0 12px; text-align: center; font: 400 16px 'Inter', sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #4a423d; }
.contact .map-svg { display: block; width: 100%; height: 380px; }

/* Tablets */
@media (max-width: 900px) {
  .contact .body { grid-template-columns: 1fr; gap: 32px; }
}

/* Phones */
@media (max-width: 600px) {
  .contact .wrap { padding-left: 16px; padding-right: 16px; }
  .contact .hero { padding-top: 40px; padding-bottom: 32px; }
  .contact .form-card { padding: 24px 20px; border-radius: 24px; }
  .contact .row { grid-template-columns: 1fr; }
  .contact .atelier { padding: 24px 20px; border-radius: 24px; }
  .contact .map-card { padding: 10px 14px 0; border-radius: 24px; }
  .contact .map-svg { height: 260px; }
  .contact .map-section { padding-bottom: 56px; }
  .contact .map-head { align-items: flex-start; flex-direction: column; }
}
`;

/* ---------- icons ---------- */
function Icon({ children, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8a3050"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const ICONS = {
  pin: (
    <Icon>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  ),
  clock: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  ),
  mail: (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Icon>
  ),
  phone: (
    <Icon>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </Icon>
  ),
};

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <Icon>
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="16.5" cy="7.5" r="0.6" fill="#8a3050" />
      </Icon>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <Icon>
        <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
      </Icon>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <Icon>
        <rect x="3" y="6" width="18" height="12" rx="4" />
        <path d="m10 9.5 5 2.5-5 2.5z" />
      </Icon>
    ),
  },
];

/* ---------- info shown in the beige card ---------- */
const INFO = [
  {
    icon: "pin",
    title: "Address",
    lines: [
      "42 Dosan-daero 45-gil, Gangnam-gu",
      "Seoul 06021, Republic of Korea",
    ],
  },
  {
    icon: "clock",
    title: "Studio hours",
    lines: ["Monday–Friday, 10:00–18:00 KST", "Visits by appointment"],
  },
  {
    icon: "mail",
    title: "Email",
    lines: ["hello@brandname.kr", "orders@brandname.kr"],
    link: "mailto:",
  },
  {
    icon: "phone",
    title: "Telephone",
    lines: ["+82 2 555 0196"],
    link: "tel:",
  },
];

/* ---------- simple street map drawn in SVG ---------- */
// Replace this whole component with <img src={mapImage} alt="Map" className="map-svg" /> if you have a map picture.
function StreetMap() {
  const vertical = [
    -600, -480, -360, -250, -130, 0, 120, 240, 370, 490, 610, 740,
  ];
  const horizontal = [-500, -390, -290, -190, -90, 10, 110, 215, 320, 430, 540];

  return (
    <svg
      className="map-svg"
      viewBox="0 0 1226 380"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Map showing the studio next to Dosan Park"
    >
      <rect width="1226" height="380" fill="#e8d6cf" />

      <g transform="rotate(-32 613 190) translate(613 190)">
        {/* road outlines, then road fill on top */}
        {[false, true].map((fill) => (
          <g
            key={fill ? "fill" : "edge"}
            stroke={fill ? "#f4ede3" : "#cbb9ad"}
            strokeWidth={fill ? 6 : 8}
            strokeLinecap="round"
          >
            {vertical.map((x) => (
              <line key={`v${x}`} x1={x} y1="-700" x2={x} y2="700" />
            ))}
            {horizontal.map((y) => (
              <line key={`h${y}`} x1="-900" y1={y} x2="900" y2={y} />
            ))}
          </g>
        ))}
      </g>

      {/* main avenues */}
      <g stroke="#f4ede3" strokeWidth="10" strokeLinecap="round" fill="none">
        <path d="M0 330 C300 300 450 290 700 380" />
        <path d="M560 0 C640 120 900 230 1226 330" />
        <path d="M0 80 C250 120 400 60 560 0" />
      </g>

      {/* park */}
      <path
        d="M540 150 L640 90 L735 150 L700 250 L620 300 L560 240 Z"
        fill="#d3ddd0"
      />

      {/* pin */}
      <circle cx="613" cy="175" r="34" fill="#8a3050" opacity="0.22" />
      <circle cx="613" cy="175" r="24" fill="#8a3050" />
      <g
        transform="translate(601 163)"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"
          transform="translate(-0 -2)"
        />
        <circle cx="12" cy="8" r="2.4" />
      </g>
      <text
        x="613"
        y="225"
        textAnchor="middle"
        fontSize="11"
        fill="#8a3050"
        fontFamily="Inter, sans-serif"
      >
        Dosan Park
      </text>
    </svg>
  );
}

/* ---------- form ---------- */
const EMPTY = { name: "", email: "", topic: "", message: "", agree: false };

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(v.email))
    errors.email = "Please enter a valid email.";
  if (v.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters.";
  if (!v.agree) errors.agree = "Please agree to the privacy policy.";
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues({ ...values, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSending(true);
    // TODO: replace with your real API call, for example:
    // await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSending(false);
    setSent(true);
    setValues(EMPTY);
  }

  return (
    <div className="contact">
      <style>{css}</style>

      {/* Hero */}
      <section className="wrap hero">
        <p className="eyebrow">We would love to hear from you</p>
        <h1>Let’s begin a conversation.</h1>
        <p className="lead">
          Questions about a look, an order, or working together? Our Seoul team
          replies within two business days.
        </p>
      </section>

      {/* Form + atelier */}
      <div className="wrap body">
        <div className="form-card">
          <h2>Send a note</h2>

          {sent ? (
            <div className="success">
              <h3>Thank you!</h3>
              <p>
                Your message is on its way. We’ll reply within two business
                days.
              </p>
              <button className="again" onClick={() => setSent(false)}>
                Send another message
              </button>
            </div>
          ) : (
            <>
              <p className="required-note">
                Fields marked with * are required.
              </p>

              <form className="form" onSubmit={handleSubmit} noValidate>
                <div className="row">
                  <div className={errors.name ? "field invalid" : "field"}>
                    <label className="lbl" htmlFor="name">
                      Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={values.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <span className="error">{errors.name}</span>
                    )}
                  </div>

                  <div className={errors.email ? "field invalid" : "field"}>
                    <label className="lbl" htmlFor="email">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <span className="error">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="field">
                  <label className="lbl" htmlFor="topic">
                    Topic
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    className={values.topic ? "" : "empty"}
                    value={values.topic}
                    onChange={handleChange}
                  >
                    <option value="">Select a topic</option>
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={errors.message ? "field invalid" : "field"}>
                  <label className="lbl" htmlFor="message">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="How can we help?"
                    value={values.message}
                    onChange={handleChange}
                  />
                  {errors.message && (
                    <span className="error">{errors.message}</span>
                  )}
                </div>

                <div className={errors.agree ? "field invalid" : "field"}>
                  <label className="consent">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={values.agree}
                      onChange={handleChange}
                    />
                    I agree to the privacy policy and understand my information
                    will be used to respond to this inquiry.
                  </label>
                  {errors.agree && (
                    <span className="error">{errors.agree}</span>
                  )}
                </div>

                <button className="send" type="submit" disabled={sending}>
                  {sending ? "Sending…" : "Send message"}{" "}
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            </>
          )}
        </div>

        <aside className="atelier">
          <h2>Visit the atelier</h2>

          {INFO.map((item) => (
            <div className="item" key={item.title}>
              <span className="circle">{ICONS[item.icon]}</span>
              <div>
                <h3>{item.title}</h3>
                {item.lines.map((line) =>
                  item.link ? (
                    <a key={line} href={item.link + line.replace(/\s/g, "")}>
                      {line}
                    </a>
                  ) : (
                    <p key={line}>{line}</p>
                  ),
                )}
              </div>
            </div>
          ))}

          <p className="follow">Follow our studio</p>
          <div className="socials">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </aside>
      </div>

      {/* Map */}
      <section className="wrap map-section">
        <div className="map-head">
          <div>
            <p className="eyebrow">Seoul, South Korea</p>
            <h2>Find our studio</h2>
          </div>
          <a
            className="open-maps"
            href={`https://www.google.com/maps/search/?api=1&query=${ADDRESS_QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in maps ↗
          </a>
        </div>

        <div className="map-card">
          <p className="map-title">Minimal street map</p>
          <StreetMap />
        </div>
      </section>
    </div>
  );
}
