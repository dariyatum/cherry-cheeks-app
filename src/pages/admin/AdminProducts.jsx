import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { slugify, useAdminProducts } from "../../data/useAdminProducts";

const LOW_STOCK = 20; // this many units or fewer counts as "Low stock"
const PAGE_SIZE = 10;

const fmt = (n) => (Number.isInteger(n) ? n : n.toFixed(2));

// Draft = switched off, Low stock = 20 or fewer units, otherwise Active
function statusOf(p) {
  if (!p.active) return { key: "draft", label: "Draft" };
  if (p.stockQuantity === 0) return { key: "low", label: "Out of stock" };
  if (p.stockQuantity <= LOW_STOCK) return { key: "low", label: "Low stock" };
  return { key: "active", label: "Active" };
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600;700&display=swap');

.adm-page {
  --berry: #8f3f56; --berry-dark: #74304a; --link: #b03a5f;
  --line: #e9dfdb; --ink: #241d1b; --muted: #7b706b;
  color: var(--ink); font-family: 'Inter', sans-serif; text-align: left;
}
.adm-page *, .adm-page *::before, .adm-page *::after { box-sizing: border-box; }
.adm-page button { font-family: inherit; }
.adm-page button:focus-visible, .adm-page a:focus-visible, .adm-page input:focus-visible, .adm-page select:focus-visible {
  outline: 2px solid var(--berry); outline-offset: 2px;
}
.adm-page .pg-top h1 { margin: 0; font: 500 38px/1.1 'Cormorant Garamond', serif; }
.adm-page .pg-top p { margin: 6px 0 0; font-size: 13px; color: var(--muted); }
@media (max-width: 900px) { .adm-page .pg-top h1 { font-size: 32px; } }
@media (prefers-reduced-motion: reduce) {
  .adm-page *, .adm-page *::before, .adm-page *::after { transition: none !important; animation: none !important; }
}
.adm-page .pg-bar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-top: 28px; }
.adm-page .pg-search { position: relative; flex: 1 1 280px; max-width: 340px; }
.adm-page .pg-search svg { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); pointer-events: none; stroke: #5f5852; fill: none; }
.adm-page .pg-search input { width: 100%; height: 46px; padding: 0 18px 0 46px; border: 1px solid var(--line); border-radius: 999px; background: #fff; color: var(--ink); font: 400 13px 'Inter', sans-serif; }
.adm-page .pg-search input::placeholder { color: #a39b93; }
.adm-page .pg-add { display: inline-flex; align-items: center; gap: 10px; height: 48px; padding: 0 26px; border: none; border-radius: 999px; background: var(--berry); color: #fff; font: 500 15px 'Inter', sans-serif; cursor: pointer; transition: background 0.2s, transform 0.2s; }
.adm-page .pg-add:hover { background: var(--berry-dark); transform: translateY(-1px); }

.adm-page .pg-chips { display: flex; gap: 10px; margin: 24px 0 20px; overflow-x: auto; scrollbar-width: none; }
.adm-page .pg-chips::-webkit-scrollbar { display: none; }
.adm-page .pg-chip { flex: none; height: 34px; padding: 0 16px; border: 1px solid var(--line); border-radius: 999px; background: #fff; color: var(--muted); font: 400 12px 'Inter', sans-serif; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
.adm-page .pg-chip:hover { border-color: var(--berry); color: var(--berry); }
.adm-page .pg-chip.on { background: var(--berry); border-color: var(--berry); color: #fff; }

.adm-page .pg-card { border: 1px solid var(--line); border-radius: 16px; background: #fffefd; overflow: hidden; }
.adm-page .pg-head { display: flex; justify-content: space-between; gap: 12px; padding: 14px 16px; background: #fbeeee; font: 700 11px 'Inter', sans-serif; letter-spacing: 0.02em; text-transform: uppercase; }
.adm-page .pg-head span:last-child { color: var(--muted); font-weight: 400; text-transform: none; }
.adm-page .pg-list { margin: 0; padding: 0; list-style: none; }
.adm-page .pg-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 16px; border-top: 1px solid var(--line); transition: background 0.2s; }
.adm-page .pg-row:first-child { border-top: none; }
.adm-page .pg-row:hover { background: #fdf8f7; }
.adm-page .pg-name { margin: 0 0 4px; font: 600 14px 'Inter', sans-serif; }
.adm-page .pg-meta { margin: 0; font-size: 12px; color: var(--muted); }
.adm-page .pg-actions { display: flex; align-items: center; gap: 16px; flex: none; font-size: 13px; }
.adm-page .pg-status { color: var(--muted); }
.adm-page .pg-status.low { color: #a8612a; }
.adm-page .pg-link { padding: 0; border: none; background: none; color: var(--link); font: 500 13px 'Inter', sans-serif; cursor: pointer; }
.adm-page .pg-link:hover { text-decoration: underline; text-underline-offset: 3px; }
.adm-page .pg-empty { margin: 0; padding: 40px 16px; text-align: center; color: var(--muted); font-size: 14px; }

.adm-page .pg-foot { display: flex; justify-content: center; align-items: center; gap: 8px; padding: 16px; border-top: 1px solid var(--line); }
.adm-page .pg-foot button { width: 36px; height: 36px; border: 1px solid var(--line); border-radius: 50%; background: #fff; font: 500 13px 'Inter', sans-serif; cursor: pointer; }
.adm-page .pg-foot button.on { background: var(--berry); border-color: var(--berry); color: #fff; }
.adm-page .pg-foot button:disabled { opacity: 0.4; cursor: default; }
.adm-page .pg-reset { margin-top: 16px; padding: 0; border: none; background: none; color: var(--muted); font: 400 12px 'Inter', sans-serif; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }

/* ---------- Dialogs ---------- */
.adm-page .pg-scrim { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 20px; background: rgba(36, 29, 27, 0.5); backdrop-filter: blur(3px); animation: pg-fade 0.2s ease; }
.adm-page .pg-modal { width: min(480px, 100%); max-height: 92vh; overflow: auto; padding: 28px; border-radius: 22px; background: #fffefd; animation: pg-pop 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.adm-page .pg-modal h2 { margin: 0 0 4px; font: 500 28px 'Cormorant Garamond', serif; }
.adm-page .pg-modal > p { margin: 0 0 20px; font-size: 13px; color: var(--muted); line-height: 1.6; }
.adm-page .pg-form { display: grid; gap: 14px; }
.adm-page .pg-two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.adm-page .pg-field { display: grid; gap: 6px; }
.adm-page .pg-field label { font: 600 12px 'Inter', sans-serif; }
.adm-page .pg-field input, .adm-page .pg-field select { height: 44px; padding: 0 14px; border: 1px solid #e2d9cf; border-radius: 10px; background: #fff; color: var(--ink); font: 400 14px 'Inter', sans-serif; }
.adm-page .pg-field.bad input, .adm-page .pg-field.bad select { border-color: #b3261e; }
.adm-page .pg-err { font-size: 12px; color: #b3261e; }
.adm-page .pg-buttons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
.adm-page .pg-btn { height: 44px; padding: 0 22px; border: 1px solid var(--berry); border-radius: 999px; background: none; color: var(--berry); font: 500 14px 'Inter', sans-serif; cursor: pointer; }
.adm-page .pg-btn.solid { background: var(--berry); color: #fff; }
.adm-page .pg-btn.danger { background: #b3261e; border-color: #b3261e; color: #fff; }

.adm-page .pg-toast { position: fixed; left: 50%; bottom: 28px; z-index: 120; padding: 12px 22px; border-radius: 999px; background: var(--ink); color: #fff; font: 500 14px 'Inter', sans-serif; white-space: nowrap; animation: pg-toast 2.4s ease forwards; }

@keyframes pg-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes pg-pop { from { opacity: 0; transform: translateY(14px) scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes pg-toast { 0% { opacity: 0; transform: translate(-50%, 14px); } 10% { opacity: 1; transform: translate(-50%, 0); } 85% { opacity: 1; } 100% { opacity: 0; } }

@media (max-width: 600px) {
  .adm-page .pg-search { max-width: none; }
  .adm-page .pg-add { width: 100%; justify-content: center; }
  .adm-page .pg-row { flex-direction: column; align-items: flex-start; gap: 10px; }
  .adm-page .pg-actions { width: 100%; justify-content: space-between; }
  .adm-page .pg-two { grid-template-columns: 1fr; }
  .adm-page .pg-modal { padding: 22px; }
}
`;

// ---------- Add / edit dialog ----------
function ProductForm({ product, noun, takenSkus, onSave, onClose }) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    brand: product?.brand ?? "Cherry Cheeks",
    price: product?.price ?? "",
    stockQuantity: product?.stockQuantity ?? "",
    active: product ? product.active : true,
  });
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  function set(key, value) {
    setForm({ ...form, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  }

  function submit(e) {
    e.preventDefault();
    const found = {};
    if (!form.name.trim()) found.name = "Enter a name.";
    if (!form.sku.trim()) found.sku = "Enter a SKU.";
    else if (takenSkus.includes(form.sku.trim().toLowerCase()))
      found.sku = "This SKU is already used.";
    if (form.price === "" || Number(form.price) < 0)
      found.price = "Enter a price of 0 or more.";
    if (
      form.stockQuantity === "" ||
      !Number.isInteger(Number(form.stockQuantity)) ||
      Number(form.stockQuantity) < 0
    )
      found.stockQuantity = "Enter a whole number of 0 or more.";
    setErrors(found);
    if (Object.keys(found).length) return;

    onSave({
      name: form.name.trim(),
      sku: form.sku.trim(),
      brand: form.brand.trim() || "Cherry Cheeks",
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      active: form.active,
    });
  }

  return (
    <div className="pg-scrim" onClick={onClose}>
      <form
        className="pg-modal"
        role="dialog"
        aria-modal="true"
        aria-label={product ? "Edit product" : "Add product"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        noValidate
      >
        <h2>{product ? `Edit ${noun}` : `Add ${noun}`}</h2>
        <p>
          {product
            ? "Update the details below."
            : "Fill in the details to add it to your inventory."}
        </p>

        <div className="pg-form">
          <div className={errors.name ? "pg-field bad" : "pg-field"}>
            <label htmlFor="f-name">Name</label>
            <input
              id="f-name"
              ref={firstRef}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            {errors.name && <span className="pg-err">{errors.name}</span>}
          </div>

          <div className="pg-two">
            <div className={errors.sku ? "pg-field bad" : "pg-field"}>
              <label htmlFor="f-sku">SKU</label>
              <input
                id="f-sku"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
              />
              {errors.sku && <span className="pg-err">{errors.sku}</span>}
            </div>
            <div className="pg-field">
              <label htmlFor="f-brand">Brand</label>
              <input
                id="f-brand"
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
              />
            </div>
          </div>

          <div className="pg-two">
            <div className={errors.price ? "pg-field bad" : "pg-field"}>
              <label htmlFor="f-price">Price (USD)</label>
              <input
                id="f-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
              />
              {errors.price && <span className="pg-err">{errors.price}</span>}
            </div>
            <div className={errors.stockQuantity ? "pg-field bad" : "pg-field"}>
              <label htmlFor="f-stock">Units in stock</label>
              <input
                id="f-stock"
                type="number"
                min="0"
                step="1"
                value={form.stockQuantity}
                onChange={(e) => set("stockQuantity", e.target.value)}
              />
              {errors.stockQuantity && (
                <span className="pg-err">{errors.stockQuantity}</span>
              )}
            </div>
          </div>

          <div className="pg-field">
            <label htmlFor="f-status">Status</label>
            <select
              id="f-status"
              value={form.active ? "active" : "draft"}
              onChange={(e) => set("active", e.target.value === "active")}
            >
              <option value="active">Active (visible in the shop)</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </div>
        </div>

        <div className="pg-buttons">
          <button type="button" className="pg-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="pg-btn solid">
            {product ? "Save changes" : `Add ${noun}`}
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------- Delete confirmation ----------
function ConfirmDelete({ product, onConfirm, onClose }) {
  return (
    <div className="pg-scrim" onClick={onClose}>
      <div
        className="pg-modal"
        role="alertdialog"
        aria-modal="true"
        aria-label="Delete product"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Delete {product.name}?</h2>
        <p>This removes it from your inventory. You can’t undo this.</p>
        <div className="pg-buttons">
          <button className="pg-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="pg-btn danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Set to false if your AdminLayout already shows the page title and date
const SHOW_HEADER = true;

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

function Page({ title, children }) {
  return (
    <div className="adm-page">
      <style>{css}</style>
      {SHOW_HEADER && (
        <header className="pg-top">
          <h1>{title}</h1>
          <p>{today}</p>
        </header>
      )}
      {children}
    </div>
  );
}

export default function AdminProducts() {
  const { category: slug = "makeup" } = useParams();
  const { products, categories, loading, error, add, update, remove, reset } =
    useAdminProducts();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // a product, or "new"
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Start fresh when you switch category
  useEffect(() => {
    setSearch("");
    setStatus("all");
    setPage(1);
  }, [slug]);

  // Escape closes any dialog
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setEditing(null);
        setDeleting(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function notify(msg) {
    clearTimeout(toastTimer.current);
    setToast({ msg, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }

  const category = categories.find((c) => slugify(c.name) === slug);
  const title = category ? category.name : "Products";

  if (loading) {
    return (
      <Page title={title}>
        <p style={{ marginTop: 32, color: "#7b706b" }}>Loading inventory…</p>
      </Page>
    );
  }

  if (error || !category) {
    return (
      <Page title="Products">
        <p style={{ marginTop: 32 }}>
          {error
            ? `Could not load products: ${error}`
            : "That category does not exist."}{" "}
          <Link to="/admin/products/makeup" style={{ color: "#b03a5f" }}>
            Go to Makeup
          </Link>
        </p>
      </Page>
    );
  }

  const noun = category.name.toLowerCase();
  const inCategory = products.filter((p) => p.categoryId === category.id);

  const counts = {
    all: inCategory.length,
    active: inCategory.filter((p) => statusOf(p).key === "active").length,
    low: inCategory.filter((p) => statusOf(p).key === "low").length,
    draft: inCategory.filter((p) => statusOf(p).key === "draft").length,
  };
  const chips = [
    { key: "all", label: `All ${noun}` },
    { key: "active", label: `Active ${noun}` },
    { key: "low", label: `Low stock ${noun}` },
    { key: "draft", label: `Draft ${noun}` },
  ];

  const q = search.trim().toLowerCase();
  const filtered = inCategory
    .filter((p) => status === "all" || statusOf(p).key === status)
    .filter((p) =>
      `${p.name} ${p.sku} ${p.brand} ${category.name}`
        .toLowerCase()
        .includes(q),
    );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE,
  );

  // SKUs already used by other products
  const takenSkus = (
    editing && editing !== "new"
      ? products.filter((p) => p.id !== editing.id)
      : products
  ).map((p) => String(p.sku).toLowerCase());

  function save(data) {
    if (editing === "new") {
      add({ ...data, categoryId: category.id });
      notify(`${data.name} added`);
    } else {
      update(editing.id, data);
      notify(`${data.name} updated`);
    }
    setEditing(null);
  }

  function confirmDelete() {
    remove(deleting.id);
    notify(`${deleting.name} deleted`);
    setDeleting(null);
  }

  return (
    <Page title={title}>
      <div className="pg-bar">
        <div className="pg-search">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            name="search"
            aria-label={`Search ${noun}`}
            placeholder={`Search ${noun}, SKU, category`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <button className="pg-add" onClick={() => setEditing("new")}>
          Add {noun} <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="pg-chips">
        {chips.map((c) => (
          <button
            key={c.key}
            className={status === c.key ? "pg-chip on" : "pg-chip"}
            aria-pressed={status === c.key}
            onClick={() => {
              setStatus(c.key);
              setPage(1);
            }}
          >
            {c.label} {counts[c.key]}
          </button>
        ))}
      </div>

      <section className="pg-card" aria-label={`${title} inventory`}>
        <div className="pg-head">
          <span>{title} inventory</span>
          <span>
            Showing {visible.length} of {filtered.length}
          </span>
        </div>

        {visible.length === 0 ? (
          <p className="pg-empty">No {noun} match your search.</p>
        ) : (
          <ul className="pg-list">
            {visible.map((p) => {
              const s = statusOf(p);
              return (
                <li className="pg-row" key={p.id}>
                  <div>
                    <p className="pg-name">{p.name}</p>
                    <p className="pg-meta">
                      {p.sku} · {category.name} · ${fmt(p.price)} ·{" "}
                      {p.stockQuantity} units
                    </p>
                  </div>
                  <div className="pg-actions">
                    <span className={`pg-status ${s.key}`}>{s.label}</span>
                    <button
                      className="pg-link"
                      aria-label={`Edit ${p.name}`}
                      onClick={() => setEditing(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="pg-link"
                      aria-label={`Delete ${p.name}`}
                      onClick={() => setDeleting(p)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {pageCount > 1 && (
          <div className="pg-foot">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={n === current ? "on" : ""}
                aria-current={n === current ? "page" : undefined}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              aria-label="Next page"
              disabled={current === pageCount}
              onClick={() => setPage(current + 1)}
            >
              →
            </button>
          </div>
        )}
      </section>

      <button
        className="pg-reset"
        onClick={() => reset().then(() => notify("Sample data restored"))}
      >
        Reset to sample data
      </button>

      {editing && (
        <ProductForm
          key={editing === "new" ? "new" : editing.id}
          product={editing === "new" ? null : editing}
          noun={noun}
          takenSkus={takenSkus}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDelete
          product={deleting}
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}

      <div aria-live="polite">
        {toast && (
          <div className="pg-toast" key={toast.id}>
            {toast.msg}
          </div>
        )}
      </div>
    </Page>
  );
}
