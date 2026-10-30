import { useEffect, useMemo, useState } from "react";
import { loadJson } from "../../data/studentData";
import { getSavedInvoices } from "../../data/invoiceStore";

// ---------- 1. CSS (internal) ----------
const styles = `
  .orders { color: #3d3530; font-family: Arial, sans-serif; padding: 12px 32px 48px; }
  .orders * { box-sizing: border-box; }

  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
  .title { margin: 0 0 8px; font-family: Georgia, serif; font-size: 44px; font-weight: normal; }
  .sub { margin: 0 0 32px; font-size: 14px; color: #8a7a70; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px; padding: 14px 24px;
    border: none; border-radius: 999px; background: #8b4a5e; color: white;
    font-size: 13px; cursor: pointer;
  }
  .btn-primary:hover { background: #763d4e; }

  /* Stat cards */
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat { padding: 20px; background: #fffdfa; border: 1px solid #eadfd6; border-radius: 14px; }
  .stat-label { margin: 0 0 12px; font-size: 12px; color: #6b5d55; }
  .stat-value { margin: 0 0 12px; font-family: Georgia, serif; font-size: 34px; color: #8b4a5e; }
  .stat-note { margin: 0; font-size: 11px; color: #8a7a70; }

  /* Search row */
  .toolbar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .search { flex: 1 1 300px; position: relative; }
  .search svg { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: #6b5d55; }
  .search input {
    width: 100%; height: 46px; padding: 0 20px 0 46px; border: 1px solid #eadfd6;
    border-radius: 999px; background: #fffdfa; font-size: 13px; color: #3d3530; outline: none;
  }
  .search input:focus { border-color: #8b4a5e; }
  .date-chip {
    display: inline-flex; align-items: center; gap: 10px; height: 46px; padding: 0 22px;
    border: 1px solid #eadfd6; border-radius: 999px; background: #fffdfa;
    color: #8b4a5e; font-size: 13px; font-weight: bold;
  }
  .date-chip input[type="date"] {
    border: none; background: transparent; color: #8b4a5e; font-size: 13px;
    font-weight: bold; font-family: inherit; outline: none; cursor: pointer;
  }
  .date-to { font-weight: normal; color: #8a7a70; }
  .date-clear {
    border: none; background: #f6e3e3; color: #8b4a5e; border-radius: 999px;
    padding: 5px 12px; font-size: 11px; cursor: pointer;
  }


  /* Tabs */
  .tabs { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
  .tab {
    display: inline-flex; align-items: center; gap: 10px; padding: 11px 18px;
    border: 1px solid #eadfd6; border-radius: 999px; background: #fffdfa;
    color: #6b5d55; font-size: 13px; cursor: pointer;
  }
  .tab .count {
    min-width: 24px; padding: 3px 7px; border-radius: 999px; background: #f6e3e3;
    color: #8b4a5e; font-size: 11px; text-align: center;
  }
  .tab.active { background: #8b4a5e; border-color: #8b4a5e; color: white; font-weight: bold; }
  .tab.active .count { background: rgba(255,255,255,0.25); color: white; }

  /* Table card */
  .panel { background: #fffdfa; border: 1px solid #eadfd6; border-radius: 14px; overflow: hidden; }
  .panel-head { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px; }
  .panel-head h2 { margin: 0; font-size: 15px; }
  .sort { border: none; background: none; font-size: 12px; color: #8a7a70; cursor: pointer; }
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; min-width: 880px; }
  th {
    padding: 14px 12px; background: #f6e3e8; text-align: left;
    font-size: 11px; font-weight: normal; color: #6b5d55;
  }
  td { padding: 18px 12px; border-top: 1px solid #eadfd6; font-size: 12px; vertical-align: middle; }
  th:first-child, td:first-child { padding-left: 20px; width: 40px; }
  .check { width: 16px; height: 16px; accent-color: #8b4a5e; cursor: pointer; }
  .order-id { color: #8b4a5e; font-weight: bold; font-size: 13px; }
  .cust-name { margin: 0 0 4px; font-size: 13px; }
  .muted { margin: 0; font-size: 11px; color: #8a7a70; }
  .total { margin: 0 0 4px; font-size: 13px; font-weight: bold; }
  .date { color: #6b5d55; }
  .row { cursor: pointer; }
  .row:hover { background: #fbf3ef; }

  /* Status pills */
  .pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 11px; }
  .pill::before { content: ""; width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
  .pill.paid, .pill.fulfilled { background: #e9efe6; color: #5b7a5e; }
  .pill.pending { background: #f5ead9; color: #a07a3c; }
  .pill.unfulfilled, .pill.cancelled, .pill.refunded { background: #f6e3e8; color: #8b4a5e; }

  .view-btn { border: none; background: none; color: #8b4a5e; cursor: pointer; padding: 6px; }
  .empty { padding: 48px 20px; text-align: center; color: #8a7a70; font-size: 13px; }

  /* Footer / pagination */
  .panel-foot {
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
    padding: 20px; border-top: 1px solid #eadfd6; flex-wrap: wrap;
  }
  .showing { font-size: 12px; color: #8a7a70; }
  .pages { display: flex; gap: 8px; }
  .pages button {
    width: 42px; height: 42px; border: 1px solid #eadfd6; border-radius: 8px;
    background: #fffdfa; color: #6b5d55; font-size: 13px; cursor: pointer;
  }
  .pages button.active { background: #8b4a5e; border-color: #8b4a5e; color: white; }
  .pages button:disabled { opacity: 0.4; cursor: default; }
  .foot-note { margin: 40px 0 0; text-align: center; font-size: 11px; color: #8a7a70; }

  /* Details popup */
  .overlay {
    position: fixed; inset: 0; z-index: 100; background: rgba(61,53,48,0.45);
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .modal {
    width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; padding: 28px;
    background: #fffdfa; border-radius: 20px;
  }
  .modal-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
  .modal h3 { margin: 0 0 6px; font-family: Georgia, serif; font-size: 26px; font-weight: normal; color: #8b4a5e; }
  .close { border: none; background: none; font-size: 22px; color: #8a7a70; cursor: pointer; }
  .line-item { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-top: 1px solid #eadfd6; font-size: 13px; }
  .sum-row { display: flex; justify-content: space-between; margin-top: 10px; font-size: 13px; color: #6b5d55; }
  .sum-row.big { padding-top: 14px; border-top: 1px solid #eadfd6; font-size: 16px; font-weight: bold; color: #3d3530; }
  .modal-actions { display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap; }
  .btn-outline {
    padding: 12px 20px; border: 1px solid #eadfd6; border-radius: 999px;
    background: #fffdfa; color: #3d3530; font-size: 13px; cursor: pointer;
  }

  @media (max-width: 1000px) { .stats { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) {
    .orders { padding: 24px 16px 32px; }
    .title { font-size: 34px; }
    .stats { grid-template-columns: 1fr; }
  }
`;

// ---------- 2. Helpers ----------
const PAGE_SIZE = 8;

function money(n) {
  return "$" + Number(n || 0).toFixed(2);
}

// 2026-10-19T15:10:00+07:00 -> "19 Oct 2026"
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// 2026-10-19T15:10:00+07:00 -> "03:10 PM" (shown in the computer's local time)
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// "19 Oct 2026, 03:10 PM"
function fmtDateTime(iso) {
  return `${fmtDate(iso)}, ${fmtTime(iso)}`;
}

// 2026-10-19T15:10:00+07:00 -> "2026-10-19" (local day, same format as <input type="date">)
function localDay(iso) {
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// One day -> "19 Oct 2026", same month -> "17–19 Oct 2026", else "28 Sep 2026 – 02 Oct 2026"
function dateRange(orders) {
  if (orders.length === 0) return "No dates";
  const times = orders.map((o) => new Date(o.createdAt).getTime());
  const from = new Date(Math.min(...times));
  const to = new Date(Math.max(...times));
  if (from.toDateString() === to.toDateString()) return fmtDate(to);
  if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
    const month = to.toLocaleDateString("en-GB", { month: "short" });
    return `${String(from.getDate()).padStart(2, "0")}–${String(to.getDate()).padStart(2, "0")} ${month} ${to.getFullYear()}`;
  }
  return `${fmtDate(from)} – ${fmtDate(to)}`;
}

// accounts.json field names can differ, so we try the common ones
function accountName(acc) {
  if (!acc) return "Walk-in customer";
  return (
    acc.fullName ||
    acc.name ||
    [acc.firstName, acc.lastName].filter(Boolean).join(" ") ||
    acc.username ||
    `Customer #${acc.id}`
  );
}

function paymentStatus(invoiceStatus) {
  const s = String(invoiceStatus).toUpperCase();
  if (s === "PAID") return "Paid";
  if (s === "REFUNDED") return "Refunded";
  if (s === "PENDING" || s === "UNPAID") return "Pending";
  return s.charAt(0) + s.slice(1).toLowerCase();
}

// The JSON has no fulfillment field, so it is worked out from the status.
// The admin can change it in the details popup (kept in the page state).
function defaultFulfillment(inv) {
  const s = String(inv.status).toUpperCase();
  if (s === "CANCELLED" || s === "VOID" || s === "REFUNDED") return "Cancelled";
  if (inv.shipping) return "Unfulfilled"; // web order that still has to be shipped
  return "Fulfilled";
}

// Download the given orders as a CSV file
function exportCsv(rows) {
  const header = ["Order", "Customer", "Email", "Date", "Total", "Payment", "Fulfillment"];
  const lines = rows.map((o) =>
    [o.invoiceNumber, o.customerName, o.email, fmtDateTime(o.createdAt), Number(o.total || 0).toFixed(2), o.payment, o.fulfillment]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orders.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- 3. Small icons ----------
function Icon({ children, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

// ---------- 4. The page ----------
function AdminOrder() {
  const [invoices, setInvoices] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");
  const [dateFrom, setDateFrom] = useState(""); // "YYYY-MM-DD" or ""
  const [dateTo, setDateTo] = useState("");
  const [newestFirst, setNewestFirst] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [overrides, setOverrides] = useState({}); // { orderKey: "Fulfilled" | "Unfulfilled" }
  const [viewing, setViewing] = useState(null);   // holds the order key, or null

  // Load the teacher's JSON files
  useEffect(() => {
    let cancelled = false;
    Promise.all([loadJson("invoices"), loadJson("accounts"), loadJson("products")])
      .then(([inv, acc, prod]) => {
        if (cancelled) return;
        setInvoices([...getSavedInvoices(), ...inv]);
        setAccounts(acc);
        setProducts(prod);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // Join invoices with customers
  const orders = useMemo(() => {
    return invoices.map((inv) => {
      const acc = accounts.find((a) => a.id === inv.customerId);
      const items = inv.items || [];
      const key = inv.id ?? inv.invoiceNumber; // safe unique key
      return {
        ...inv,
        items,
        key,
        customerName:
          inv.customerId === null && inv.shipping
            ? `${inv.shipping.firstName} ${inv.shipping.lastName}`
            : accountName(inv.customerId === null ? null : acc),
        email: acc?.email || inv.customerEmail || (inv.customerId === null ? "No email" : ""),
        itemCount: items.reduce((sum, l) => sum + l.quantity, 0),
        payment: paymentStatus(inv.status),
        fulfillment: overrides[key] || defaultFulfillment(inv),
      };
    });
  }, [invoices, accounts, overrides]);

  // Stat cards
  const paidOrders = orders.filter((o) => o.payment === "Paid");
  const paidRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const toFulfill = orders.filter((o) => o.fulfillment === "Unfulfilled");
  const refunded = orders.filter((o) => o.payment === "Refunded");
  const refundedTotal = refunded.reduce((sum, o) => sum + o.total, 0);

  const tabs = ["All", "Unfulfilled", "Fulfilled", "Cancelled"];
  const countFor = (t) =>
    t === "All" ? orders.length : orders.filter((o) => o.fulfillment === t).length;

  // Filter, sort, paginate
  const q = search.trim().toLowerCase();
  const filtered = orders
    .filter((o) => tab === "All" || o.fulfillment === tab)
    .filter((o) => `${o.invoiceNumber} ${o.customerName} ${o.email}`.toLowerCase().includes(q))
    .filter((o) => {
      const day = localDay(o.createdAt);
      return (!dateFrom || day >= dateFrom) && (!dateTo || day <= dateTo);
    })
    .sort((a, b) => {
      const diff = new Date(b.createdAt) - new Date(a.createdAt);
      return newestFirst ? diff : -diff;
    });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const allVisibleSelected = visible.length > 0 && visible.every((o) => selected.includes(o.key));

  function toggleOne(key) {
    setSelected((cur) => (cur.includes(key) ? cur.filter((x) => x !== key) : [...cur, key]));
  }

  function toggleAll() {
    const keys = visible.map((o) => o.key);
    setSelected((cur) =>
      allVisibleSelected ? cur.filter((k) => !keys.includes(k)) : [...new Set([...cur, ...keys])]
    );
  }

  function changeTab(t) {
    setTab(t);
    setPage(1);
  }

  function setFulfillment(key, value) {
    setOverrides((cur) => ({ ...cur, [key]: value }));
  }

  // Export the selected orders, or every order in the current filter
  function handleExport() {
    const rows = selected.length > 0 ? orders.filter((o) => selected.includes(o.key)) : filtered;
    exportCsv(rows);
  }

  // The popup always reads the latest data of the order
  const viewed = viewing !== null ? orders.find((o) => o.key === viewing) : null;

  return (
    <div className="orders">
      <style>{styles}</style>

      {/* Title row */}
      <div className="head">
        <div>
          <h1 className="title">Orders</h1>
          <p className="sub">A little care in every order. Manage them all here.</p>
        </div>

        <button className="btn-primary" onClick={handleExport}>
          <Icon>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m7 10 5 5 5-5" />
            <path d="M12 15V3" />
          </Icon>
          Export orders
        </button>
      </div>

      {loading && <p className="empty">Loading orders…</p>}
      {error && <p className="empty">Could not load orders: {error}</p>}

      {!loading && !error && (
        <>
          {/* Stat cards */}
          <div className="stats">
            <div className="stat">
              <p className="stat-label">Total orders</p>
              <p className="stat-value">{orders.length}</p>
              <p className="stat-note">{dateRange(orders)}</p>
            </div>
            <div className="stat">
              <p className="stat-label">Paid revenue</p>
              <p className="stat-value">{money(paidRevenue)}</p>
              <p className="stat-note">{paidOrders.length} paid orders</p>
            </div>
            <div className="stat">
              <p className="stat-label">To fulfill</p>
              <p className="stat-value">{toFulfill.length}</p>
              <p className="stat-note">{toFulfill.filter((o) => o.payment === "Paid").length} ready to pack</p>
            </div>
            <div className="stat">
              <p className="stat-label">Refunded</p>
              <p className="stat-value">{refunded.length}</p>
              <p className="stat-note">{money(refundedTotal)} returned</p>
            </div>
          </div>

          {/* Search + date range */}
          <div className="toolbar">
            <div className="search">
              <Icon>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </Icon>
              <input
                type="text"
                placeholder="Search by order ID, customer or email…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="date-chip">
              <Icon>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </Icon>
              <input
                type="date"
                aria-label="From date"
                value={dateFrom}
                max={dateTo || undefined}
                onClick={(e) => e.target.showPicker?.()}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
              />
              <span className="date-to">to</span>
              <input
                type="date"
                aria-label="To date"
                value={dateTo}
                min={dateFrom || undefined}
                onClick={(e) => e.target.showPicker?.()}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
              />
              {(dateFrom || dateTo) && (
                <button
                  className="date-clear"
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                    setPage(1);
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {tabs.map((t) => (
              <button
                key={t}
                className={t === tab ? "tab active" : "tab"}
                onClick={() => changeTab(t)}
              >
                {t === "All" ? "All orders" : t}
                <span className="count">{countFor(t)}</span>
              </button>
            ))}
          </div>

          {/* Table */}
          <section className="panel">
            <div className="panel-head">
              <h2>{tab === "All" ? "All orders" : `${tab} orders`}</h2>
              <button className="sort" onClick={() => setNewestFirst(!newestFirst)}>
                {newestFirst ? "Newest first ↓" : "Oldest first ↑"}
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        className="check"
                        checked={allVisibleSelected}
                        onChange={toggleAll}
                        aria-label="Select all orders"
                      />
                    </th>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Fulfillment</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((o) => (
                    // The whole row opens the popup
                    <tr key={o.key} className="row" onClick={() => setViewing(o.key)}>
                      {/* Checkbox click must not open the popup */}
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="check"
                          checked={selected.includes(o.key)}
                          onChange={() => toggleOne(o.key)}
                          aria-label={`Select ${o.invoiceNumber}`}
                        />
                      </td>
                      <td><span className="order-id">{o.invoiceNumber}</span></td>
                      <td>
                        <p className="cust-name">{o.customerName}</p>
                        <p className="muted">{o.email}</p>
                      </td>
                      <td className="date">
                        <p className="cust-name">{fmtDate(o.createdAt)}</p>
                        <p className="muted">{fmtTime(o.createdAt)}</p>
                      </td>
                      <td>
                        <p className="total">{money(o.total)}</p>
                        <p className="muted">{o.itemCount} items</p>
                      </td>
                      <td><span className={`pill ${o.payment.toLowerCase()}`}>{o.payment}</span></td>
                      <td><span className={`pill ${o.fulfillment.toLowerCase()}`}>{o.fulfillment}</span></td>
                      <td>
                        <button className="view-btn" aria-label={`View ${o.invoiceNumber}`}>
                          <Icon>
                            <path d="M7 17 17 7" />
                            <path d="M8 7h9v9" />
                          </Icon>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visible.length === 0 && <p className="empty">No orders match your search.</p>}
            </div>

            <div className="panel-foot">
              <span className="showing">
                Showing {filtered.length === 0 ? 0 : start + 1}–{start + visible.length} of {filtered.length} orders
              </span>

              <div className="pages">
                <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} aria-label="Previous page">‹</button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button key={n} className={n === currentPage ? "active" : ""} onClick={() => setPage(n)}>
                    {n}
                  </button>
                ))}
                <button disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} aria-label="Next page">›</button>
              </div>
            </div>
          </section>

          <p className="foot-note">Cherry Cheeks · Made for your everyday glow</p>
        </>
      )}

      {/* Order details popup */}
      {viewed && (
        <div className="overlay" onClick={() => setViewing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>{viewed.invoiceNumber}</h3>
                <p className="muted">
                  {viewed.customerName} · {viewed.email} · {fmtDateTime(viewed.createdAt)}
                </p>
              </div>
              <button className="close" onClick={() => setViewing(null)} aria-label="Close">×</button>
            </div>

            {viewed.items.map((line, i) => {
              const product = products.find((p) => p.id === line.productId);
              return (
                <div className="line-item" key={`${line.productId}-${i}`}>
                  <span>
                    {product ? product.name : `Product #${line.productId}`} × {line.quantity}
                  </span>
                  <span>{money(line.lineTotal)}</span>
                </div>
              );
            })}

            <div className="sum-row"><span>Subtotal</span><span>{money(viewed.subtotal)}</span></div>
            <div className="sum-row"><span>Discount</span><span>−{money(viewed.discount)}</span></div>
            <div className="sum-row"><span>Tax</span><span>{money(viewed.tax)}</span></div>
            <div className="sum-row big"><span>Total</span><span>{money(viewed.total)}</span></div>

            <div className="sum-row">
              <span>Paid with</span>
              <span>{(viewed.payments || []).map((p) => p.method).join(", ") || "—"}</span>
            </div>

            <div className="modal-actions">
              {viewed.fulfillment !== "Cancelled" && (
                <button
                  className="btn-primary"
                  onClick={() =>
                    setFulfillment(viewed.key, viewed.fulfillment === "Fulfilled" ? "Unfulfilled" : "Fulfilled")
                  }
                >
                  {viewed.fulfillment === "Fulfilled" ? "Mark as unfulfilled" : "Mark as fulfilled"}
                </button>
              )}
              <button className="btn-outline" onClick={() => setViewing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrder;