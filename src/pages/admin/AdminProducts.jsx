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

// ---------- Shared class strings ----------
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8f3f56]";

const inputBase =
  "box-border h-11 w-full min-w-0 appearance-none rounded-[10px] border bg-white px-3.5 text-sm text-[#241d1b] " +
  focusRing +
  " [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const btnBase =
  "box-border h-11 cursor-pointer rounded-full border px-[22px] text-sm font-medium leading-none transition-colors " +
  focusRing;
const btnOutline = `${btnBase} border-[#8f3f56] bg-transparent text-[#8f3f56] hover:bg-[#8f3f56]/5`;
const btnSolid = `${btnBase} border-[#8f3f56] bg-[#8f3f56] text-white hover:bg-[#74304a]`;
const btnDanger = `${btnBase} border-[#b3261e] bg-[#b3261e] text-white hover:bg-[#8f1d17]`;

const linkBtn =
  "cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium text-[#b03a5f] hover:underline hover:underline-offset-[3px] " +
  focusRing;

const scrim =
  "fixed inset-0 z-[100] box-border grid place-items-center bg-[#241d1b]/50 p-5 backdrop-blur-[3px]";

const modalBox =
  "box-border max-h-[92vh] w-[min(480px,100%)] overflow-y-auto overflow-x-hidden rounded-[22px] bg-[#fffefd] [&_*]:box-border";

const modalTitle =
  "m-0 mb-1 font-['Cormorant_Garamond',serif] text-[28px] font-medium";
const modalText = "m-0 mb-5 text-[13px] leading-relaxed text-[#7b706b]";

// ---------- Small field wrapper ----------
function Field({ id, label, error, children }) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold">
        {label}
      </label>
      {children}
      {error && <span className="text-xs text-[#b3261e]">{error}</span>}
    </div>
  );
}

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

  const border = (key) =>
    errors[key] ? "border-[#b3261e]" : "border-[#e2d9cf]";

  return (
    <div className={scrim} onClick={onClose}>
      <form
        className={modalBox}
        role="dialog"
        aria-modal="true"
        aria-label={product ? "Edit product" : "Add product"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        noValidate
      >
        <div style={{ padding: 28 }}>
          <h2 className={modalTitle}>
            {product ? `Edit ${noun}` : `Add ${noun}`}
          </h2>
          <p className={modalText}>
            {product
              ? "Update the details below."
              : "Fill in the details to add it to your inventory."}
          </p>

          <div className="grid gap-3.5">
            <Field id="f-name" label="Name" error={errors.name}>
              <input
                id="f-name"
                ref={firstRef}
                className={`${inputBase} ${border("name")}`}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field id="f-sku" label="SKU" error={errors.sku}>
                <input
                  id="f-sku"
                  className={`${inputBase} ${border("sku")}`}
                  value={form.sku}
                  onChange={(e) => set("sku", e.target.value)}
                />
              </Field>
              <Field id="f-brand" label="Brand">
                <input
                  id="f-brand"
                  className={`${inputBase} border-[#e2d9cf]`}
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field id="f-price" label="Price (USD)" error={errors.price}>
                <input
                  id="f-price"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`${inputBase} ${border("price")}`}
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </Field>
              <Field
                id="f-stock"
                label="Units in stock"
                error={errors.stockQuantity}
              >
                <input
                  id="f-stock"
                  type="number"
                  min="0"
                  step="1"
                  className={`${inputBase} ${border("stockQuantity")}`}
                  value={form.stockQuantity}
                  onChange={(e) => set("stockQuantity", e.target.value)}
                />
              </Field>
            </div>

            <Field id="f-status" label="Status">
              <div className="relative">
                <select
                  id="f-status"
                  className={`${inputBase} border-[#e2d9cf] pr-9`}
                  value={form.active ? "active" : "draft"}
                  onChange={(e) => set("active", e.target.value === "active")}
                >
                  <option value="active">Active (visible in the shop)</option>
                  <option value="draft">Draft (hidden)</option>
                </select>
                <svg
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7b706b"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </Field>
          </div>

          <div className="mt-5 flex justify-end gap-2.5">
            <button type="button" className={btnOutline} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={btnSolid}>
              {product ? "Save changes" : `Add ${noun}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ---------- Delete confirmation ----------
function ConfirmDelete({ product, onConfirm, onClose }) {
  return (
    <div className={scrim} onClick={onClose}>
      <div
        className={modalBox}
        role="alertdialog"
        aria-modal="true"
        aria-label="Delete product"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: 28 }}>
          <h2 className={modalTitle}>Delete {product.name}?</h2>
          <p className={modalText}>
            This removes it from your inventory. You can’t undo this.
          </p>
          <div className="mt-5 flex justify-end gap-2.5">
            <button className={btnOutline} onClick={onClose}>
              Cancel
            </button>
            <button className={btnDanger} onClick={onConfirm}>
              Delete
            </button>
          </div>
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
    <div className="text-left font-['Inter',sans-serif] text-[#241d1b]">
      {SHOW_HEADER && (
        <header>
          <h1 className="m-0 font-['Cormorant_Garamond',serif] text-[32px] font-medium leading-[1.1] md:text-[38px]">
            {title}
          </h1>
          <p className="m-0 mt-1.5 text-[13px] text-[#7b706b]">{today}</p>
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
        <p className="mt-8 text-[#7b706b]">Loading inventory…</p>
      </Page>
    );
  }

  if (error || !category) {
    return (
      <Page title="Products">
        <p className="mt-8">
          {error
            ? `Could not load products: ${error}`
            : "That category does not exist."}{" "}
          <Link to="/admin/products/makeup" className="text-[#b03a5f]">
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
      {/* Search + add */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <div className="relative max-w-none flex-[1_1_280px] sm:max-w-[340px]">
          <svg
            className="pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2 fill-none stroke-[#5f5852]"
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
            className={`box-border h-[46px] w-full rounded-full border border-[#e9dfdb] bg-white pl-[46px] pr-[18px] text-[13px] text-[#241d1b] placeholder:text-[#a39b93] ${focusRing}`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <button
          className={`inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border-0 bg-[#8f3f56] px-[26px] text-[15px] font-medium text-white transition hover:-translate-y-px hover:bg-[#74304a] motion-reduce:transition-none sm:w-auto ${focusRing}`}
          onClick={() => setEditing("new")}
        >
          Add {noun} <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Status chips */}
      <div className="mb-5 mt-6 flex gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((c) => (
          <button
            key={c.key}
            className={`h-[34px] flex-none cursor-pointer rounded-full border px-4 text-xs transition-colors motion-reduce:transition-none ${focusRing} ${
              status === c.key
                ? "border-[#8f3f56] bg-[#8f3f56] text-white"
                : "border-[#e9dfdb] bg-white text-[#7b706b] hover:border-[#8f3f56] hover:text-[#8f3f56]"
            }`}
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

      {/* Inventory card */}
      <section
        className="overflow-hidden rounded-2xl border border-[#e9dfdb] bg-[#fffefd]"
        aria-label={`${title} inventory`}
      >
        <div className="flex justify-between gap-3 bg-[#fbeeee] px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.02em]">
          <span>{title} inventory</span>
          <span className="font-normal normal-case tracking-normal text-[#7b706b]">
            Showing {visible.length} of {filtered.length}
          </span>
        </div>

        {visible.length === 0 ? (
          <p className="m-0 px-4 py-10 text-center text-sm text-[#7b706b]">
            No {noun} match your search.
          </p>
        ) : (
          <ul className="m-0 list-none divide-y divide-[#e9dfdb] p-0">
            {visible.map((p) => {
              const s = statusOf(p);
              return (
                <li
                  key={p.id}
                  className="flex flex-col items-start gap-2.5 p-4 transition-colors hover:bg-[#fdf8f7] motion-reduce:transition-none sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div>
                    <p className="m-0 mb-1 text-sm font-semibold">{p.name}</p>
                    <p className="m-0 text-xs text-[#7b706b]">
                      {p.sku} · {category.name} · ${fmt(p.price)} ·{" "}
                      {p.stockQuantity} units
                    </p>
                  </div>
                  <div className="flex w-full flex-none items-center justify-between gap-4 text-[13px] sm:w-auto sm:justify-start">
                    <span
                      className={
                        s.key === "low" ? "text-[#a8612a]" : "text-[#7b706b]"
                      }
                    >
                      {s.label}
                    </span>
                    <button
                      className={linkBtn}
                      aria-label={`Edit ${p.name}`}
                      onClick={() => setEditing(p)}
                    >
                      Edit
                    </button>
                    <button
                      className={linkBtn}
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
          <div className="flex items-center justify-center gap-2 border-t border-[#e9dfdb] p-4">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`size-9 cursor-pointer rounded-full border text-[13px] font-medium ${focusRing} ${
                  n === current
                    ? "border-[#8f3f56] bg-[#8f3f56] text-white"
                    : "border-[#e9dfdb] bg-white"
                }`}
                aria-current={n === current ? "page" : undefined}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className={`size-9 cursor-pointer rounded-full border border-[#e9dfdb] bg-white text-[13px] font-medium disabled:cursor-default disabled:opacity-40 ${focusRing}`}
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
        className={`mt-4 cursor-pointer border-0 bg-transparent p-0 text-xs text-[#7b706b] underline underline-offset-[3px] ${focusRing}`}
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
          <div
            key={toast.id}
            className="fixed bottom-7 left-1/2 z-[120] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#241d1b] px-[22px] py-3 text-sm font-medium text-white"
          >
            {toast.msg}
          </div>
        )}
      </div>
    </Page>
  );
}
