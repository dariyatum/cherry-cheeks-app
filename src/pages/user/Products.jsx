import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../data/useProducts";

const PRICES = [
  { label: "Under $10", test: (p) => p < 10 },
  { label: "$10–$20", test: (p) => p >= 10 && p <= 20 },
  { label: "$20+", test: (p) => p > 20 },
];
const PAGE_SIZE = 8; // 12 products make 2 pages

/* ------------------------------------------------------------------
   Hand-drawn doodles. Add or change shapes here.
------------------------------------------------------------------- */
const SHAPES = {
  blob: (
    <svg viewBox="0 0 520 460">
      <path
        d="M300 40c80 10 170 70 200 160s-10 190-100 230-210 20-270-60S20 190 90 110 220 30 300 40z"
        fill="#f3dedb"
      />
    </svg>
  ),
  blobSand: (
    <svg viewBox="0 0 400 360">
      <path
        d="M210 20c70 4 150 50 170 120s-20 150-100 190-190 10-240-60S10 150 70 80 150 16 210 20z"
        fill="#efe3d6"
      />
    </svg>
  ),
  cherry: (
    <svg
      viewBox="0 0 150 170"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M74 14C66 52 50 84 36 104" stroke="#6f8f72" strokeWidth="4" />
      <path d="M74 14C84 50 100 80 112 100" stroke="#6f8f72" strokeWidth="4" />
      <path
        d="M74 14C92 2 116 4 130 20 110 30 88 28 74 14z"
        fill="#a9c3a4"
        stroke="#6f8f72"
        strokeWidth="3"
      />
      <circle cx="38" cy="130" r="32" fill="#8a3050" />
      <circle cx="110" cy="124" r="29" fill="#b03a5f" />
      <path
        d="M24 120c2-9 9-15 17-16"
        stroke="#fff"
        strokeWidth="4"
        opacity="0.65"
      />
      <path
        d="M97 114c2-8 8-13 15-14"
        stroke="#fff"
        strokeWidth="4"
        opacity="0.65"
      />
    </svg>
  ),
  lipstick: (
    <svg
      viewBox="0 0 64 130"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="12"
        y="70"
        width="40"
        height="54"
        rx="5"
        fill="#fff"
        stroke="#8a3050"
        strokeWidth="3"
      />
      <rect
        x="16"
        y="52"
        width="32"
        height="18"
        rx="3"
        fill="#f3dedb"
        stroke="#8a3050"
        strokeWidth="3"
      />
      <path
        d="M20 52V28c0-14 24-22 24 0v24"
        fill="#b03a5f"
        stroke="#8a3050"
        strokeWidth="3"
      />
      <path
        d="M22 86h20M22 98h20"
        stroke="#8a3050"
        strokeWidth="2.5"
        opacity="0.5"
      />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 40 40" fill="none" strokeLinejoin="round">
      <path
        d="M20 3c1 10 7 16 17 17-10 1-16 7-17 17-1-10-7-16-17-17 10-1 16-7 17-17z"
        fill="#f9e9e6"
        stroke="#8a3050"
        strokeWidth="2.5"
      />
    </svg>
  ),
  squiggle: (
    <svg
      viewBox="0 0 140 40"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M4 22c12-22 22 22 34 0s22 22 34 0 22 22 34 0 22 22 30 0"
        stroke="#8a3050"
        strokeWidth="3.5"
      />
    </svg>
  ),
  flower: (
    <svg viewBox="0 0 80 80" fill="none">
      {[
        [57, 40],
        [45.25, 56.17],
        [26.25, 50],
        [26.25, 30],
        [45.25, 23.83],
      ].map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="11"
          fill="#f9e9e6"
          stroke="#8a3050"
          strokeWidth="2.5"
        />
      ))}
      <circle cx="40" cy="40" r="7" fill="#e9b872" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 40 36" fill="none" strokeLinejoin="round">
      <path
        d="M20 33C6 22 2 14 5 8c3-6 11-6 15 1 4-7 12-7 15-1 3 6-1 14-15 25z"
        fill="#f3dedb"
        stroke="#8a3050"
        strokeWidth="2.5"
      />
    </svg>
  ),
};

function Doodle({ name, className = "" }) {
  return (
    <span className={`dd ${className}`} aria-hidden="true">
      {SHAPES[name]}
    </span>
  );
}

// Every rule starts with ".products" so it cannot clash with your teammates' CSS
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Inter:wght@400;500;600;700&display=swap');

.products { position: relative; overflow-x: clip; background: #faf7f2; color: #2b2420; font-family: 'Inter', sans-serif; text-align: left; }
.products *, .products *::before, .products *::after { box-sizing: border-box; }
.products .wrap { max-width: 1296px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }

/* ---------- Doodles + parallax ----------
   --s  = how fast it moves when you scroll (positive = slower than the page, negative = faster)
   --px / --py = how far it follows the mouse
   --r  = rotation, --w = width                                                  */
.products .dd {
  position: absolute; z-index: 1; width: var(--w, 80px); pointer-events: none; will-change: transform;
  transform:
    translate3d(
      calc(var(--mx, 0) * var(--px, 0) * 1px),
      calc(var(--sy, 0) * var(--s, 0) * 1px + var(--my, 0) * var(--py, 0) * 1px),
      0
    )
    rotate(var(--r, 0deg));
  transition: transform 0.25s ease-out;
}
.products .dd svg { display: block; width: 100%; height: auto; overflow: visible; }
.products .dd.float svg { animation: pr-float 6s ease-in-out infinite; }
.products .dd.spin svg { animation: pr-spin 40s linear infinite; }
.products .dd.static { position: relative; display: block; margin: 0 0 12px; --w: 84px; }

.products .dd-blob { --w: 560px; right: -120px; top: -100px; z-index: 0; --s: 0.22; --px: 14; --py: 10; }
.products .dd-blob2 { --w: 380px; left: -150px; bottom: -150px; z-index: 0; --s: 0.1; --px: -10; --py: -8; }
.products .dd-cherry { --w: 170px; right: 8%; top: 30px; --r: 8deg; --s: 0.12; --px: -22; --py: -14; }
.products .dd-lip { --w: 62px; right: 27%; bottom: 40px; --r: -16deg; --s: -0.06; --px: 30; --py: 20; }
.products .dd-sp1 { --w: 38px; right: 4%; top: 250px; --s: -0.1; --px: -40; --py: 26; }
.products .dd-sp2 { --w: 26px; right: 36%; top: 60px; --s: -0.14; --px: 24; --py: -22; }
.products .dd-sp3 { --w: 30px; right: 19%; bottom: 14px; --s: 0.08; --px: -18; --py: 14; }
.products .dd-sq { --w: 120px; right: 25%; top: 150px; --r: -6deg; --s: 0.05; --px: 18; --py: 10; }
.products .dd-flower { --w: 64px; right: 3%; bottom: 46px; --s: -0.05; --px: -26; --py: 18; }
.products .dd-h1 { --w: 26px; right: 21%; top: 218px; --r: -14deg; --s: -0.09; --px: 22; --py: -16; }
.products .dd-h2 { --w: 20px; right: 33%; bottom: 100px; --r: 12deg; --s: 0.07; --px: -14; --py: 12; }

/* ---------- Hero ---------- */
.products .hero { position: relative; overflow: hidden; padding: 88px 0 64px; border-bottom: 1px solid #e8e1d8; }
.products .hero .wrap { position: relative; z-index: 2; }
.products .eyebrow { margin: 0 0 18px; font: 600 12px 'Inter', sans-serif; letter-spacing: 0.18em; text-transform: uppercase; color: #8a3050; }
.products .hero h1 { margin: 0 0 20px; max-width: 12ch; font: 500 clamp(48px, 8.5vw, 104px)/1 'Cormorant Garamond', serif; letter-spacing: -0.015em; }
.products .scribble { position: relative; display: inline-block; }
.products .scribble svg { position: absolute; left: -2%; bottom: -0.14em; width: 104%; height: 0.3em; overflow: visible; }
.products .scribble path { fill: none; stroke: #8a3050; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: pr-draw 1.1s 0.5s ease forwards; }
.products .lead { max-width: 520px; margin: 0 0 32px; font-size: 16px; line-height: 1.7; color: #5f5852; }

/* Search + sort */
.products .toolbar { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; }
.products .search { position: relative; flex: 1 1 280px; max-width: 430px; }
.products .search svg { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.products .search input { width: 100%; padding: 16px 20px 16px 46px; border: 1px solid #e2d9cf; border-radius: 999px; background: #fdfbf8; color: #2b2420; font: 400 14px 'Inter', sans-serif; }
.products .sort select {
  appearance: none; padding: 16px 44px 16px 20px; border: 1px solid #e2d9cf; border-radius: 999px; color: #2b2420;
  background: #fdfbf8 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232b2420' stroke-width='3'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 18px center;
  font: 400 13px 'Inter', sans-serif; cursor: pointer;
}
.products .search input:focus, .products .sort select:focus { outline: 2px solid #8a3050; outline-offset: 1px; }

/* Sidebar + content */
.products .layout { position: relative; z-index: 2; display: flex; gap: 40px; padding-top: 32px; padding-bottom: 64px; }
.products .sidebar { flex: 0 0 200px; }
.products .content { flex: 1; min-width: 0; }

.products .filters-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.products .filters-head h3 { margin: 0; font: 600 13px 'Inter', sans-serif; }
.products .clear { border: none; background: none; color: #8a3050; font: 400 11px 'Inter', sans-serif; text-decoration: underline; cursor: pointer; }
.products .group { padding: 20px 0; }
.products .group + .group { border-top: 1px solid #e8e1d8; }
.products .group h4 { margin: 0 0 14px; font: 600 11px 'Inter', sans-serif; letter-spacing: 0.14em; text-transform: uppercase; }
.products .group label { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 13px; color: #5f5852; cursor: pointer; }
.products .group input { width: 16px; height: 16px; margin: 0; accent-color: #8a3050; }
.products .filters-toggle { display: none; }

/* Little note under the filters */
.products .side-note { position: relative; margin-top: 12px; padding: 22px 18px 20px; border-radius: 20px; background: #f3dedb; overflow: hidden; }
.products .side-note .dd { position: relative; display: block; margin: 0 0 10px; --w: 56px; }
.products .side-note strong { display: block; margin-bottom: 4px; font: 500 20px/1.15 'Cormorant Garamond', serif; color: #8a3050; }
.products .side-note p { margin: 0; font-size: 12px; line-height: 1.5; color: #6b4a52; }

/* Top bar */
.products .topbar { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; margin-bottom: 24px; font-size: 12px; color: #5f5852; }
.products .ship { color: #5b7a5e; }

/* Grid + card */
.products .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 32px 20px; }
.products .card-link { display: block; text-decoration: none; color: inherit; }
.products .image-box { position: relative; aspect-ratio: 332 / 300; border-radius: 20px; overflow: hidden; background: #efe3d6; }
.products .image-box img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.products .card-link:hover .image-box img { transform: scale(1.03); }
.products .badge { position: absolute; top: 12px; left: 12px; padding: 8px 14px; border-radius: 999px; background: white; color: #8a3050; font: 600 11px 'Inter', sans-serif; letter-spacing: 0.14em; text-transform: uppercase; line-height: 1; }
.products .meta { margin: 14px 0 0; font: 400 10px 'Inter', sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #8d857d; }
.products .card-link h3 { margin: 4px 0 6px; font: 500 24px/1.2 'Cormorant Garamond', serif; }
.products .price { margin: 0; font: 700 14px 'Inter', sans-serif; }
.products .empty { padding: 48px 0; color: #5f5852; }

/* Pagination */
.products .pages { display: flex; justify-content: center; gap: 8px; margin-top: 48px; }
.products .pages button { width: 38px; height: 38px; border: 1px solid #e2d9cf; border-radius: 50%; background: white; color: #2b2420; font: 500 12px 'Inter', sans-serif; cursor: pointer; }
.products .pages button.active { background: #8a3050; border-color: #8a3050; color: white; }
.products .pages button:disabled { opacity: 0.4; cursor: default; }

@keyframes pr-float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-10px) rotate(4deg); } }
@keyframes pr-spin { to { transform: rotate(360deg); } }
@keyframes pr-draw { to { stroke-dashoffset: 0; } }

/* Laptops: tuck the doodles in a little */
@media (max-width: 1100px) {
  .products .dd-sq, .products .dd-h2 { display: none; }
  .products .dd-cherry { --w: 140px; }
}

/* Tablets and phones: filters collapse behind a button */
@media (max-width: 900px) {
  .products .hero { padding: 64px 0 44px; }
  .products .dd-lip, .products .dd-flower, .products .dd-h1, .products .dd-sp3 { display: none; }
  .products .dd-blob { --w: 400px; right: -120px; top: -70px; }
  .products .dd-cherry { --w: 120px; right: 4%; top: 24px; }
  .products .layout { flex-direction: column; gap: 0; padding-top: 24px; }
  .products .sidebar { display: none; flex: none; }
  .products .sidebar.open { display: block; margin-bottom: 24px; }
  .products .filters-toggle {
    display: block; width: 100%; margin-bottom: 16px; padding: 14px;
    border: 1px solid #e2d9cf; border-radius: 999px; background: white; color: #2b2420;
    font: 500 13px 'Inter', sans-serif; cursor: pointer;
  }
}

@media (max-width: 600px) {
  .products .wrap { padding-left: 16px; padding-right: 16px; }
  .products .hero { padding: 56px 0 32px; }
  .products .dd-blob2, .products .dd-sp2 { display: none; }
  .products .dd-blob { --w: 300px; right: -110px; top: -60px; }
  .products .dd-cherry { --w: 84px; right: 2%; top: 10px; }
  .products .dd-sp1 { --w: 26px; right: 6%; top: 150px; }
  .products .toolbar { flex-direction: column; }
  .products .search { max-width: none; flex: none; }
  .products .sort select { width: 100%; }
  .products .grid { gap: 24px 14px; }
  .products .card-link h3 { font-size: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .products .dd { transform: rotate(var(--r, 0deg)); transition: none; }
  .products .dd svg { animation: none !important; }
  .products .scribble path { animation: none; stroke-dashoffset: 0; }
  .products .image-box img { transition: none; }
}
`;

// One block of checkboxes (Category, Price or Finish)
function FilterGroup({
  title,
  name,
  allLabel,
  options,
  selected,
  onToggle,
  onClear,
}) {
  return (
    <div className="group">
      <h4>{title}</h4>
      <label>
        <input
          type="checkbox"
          name={`${name}-all`}
          checked={selected.length === 0}
          onChange={onClear}
        />
        {allLabel}
      </label>
      {options.map((option) => (
        <label key={option}>
          <input
            type="checkbox"
            name={name}
            value={option}
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
}

function ProductCard({ id, name, price, image, badge, category }) {
  return (
    <Link to={`/product/${id}`} className="card-link">
      <div className="image-box">
        {image && <img src={image} alt={name} loading="lazy" />}
        {badge && <span className="badge">{badge}</span>}
      </div>
      {category && <p className="meta">{category}</p>}
      <h3>{name}</h3>
      <p className="price">${Number(price).toFixed(2)}</p>
    </Link>
  );
}

export default function Products() {
  // Data from /student-data/products.json and categories.json
  const { products, categories: categoryList, loading, error } = useProducts();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("best");
  const [categories, setCategories] = useState([]);
  const [prices, setPrices] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Parallax: write the scroll position into a CSS variable (no re-render)
  const rootRef = useRef(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        el.style.setProperty("--sy", String(window.scrollY)),
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
    };
  }, [loading, error]);

  // Parallax: the doodles also drift toward the mouse while it is over the hero
  function onHeroMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--mx",
      ((e.clientX - r.left) / r.width - 0.5).toFixed(3),
    );
    e.currentTarget.style.setProperty(
      "--my",
      ((e.clientY - r.top) / r.height - 0.5).toFixed(3),
    );
  }
  function onHeroLeave(e) {
    e.currentTarget.style.setProperty("--mx", "0");
    e.currentTarget.style.setProperty("--my", "0");
  }

  // Add or remove a value from a list, and go back to page 1
  function toggle(list, setList, value) {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
    setPage(1);
  }

  function clearAll() {
    setSearch("");
    setCategories([]);
    setPrices([]);
    setFinishes([]);
    setPage(1);
  }

  function goToPage(n) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) return <p style={{ padding: 40 }}>Loading products…</p>;
  if (error)
    return <p style={{ padding: 40 }}>Could not load products: {error}</p>;

  // Filter options come from the data
  const categoryNames = categoryList.map((c) => c.name);
  const finishNames = [
    ...new Set(products.map((p) => p.finish).filter(Boolean)),
  ];

  // 1. Filter
  const q = search.trim().toLowerCase();
  const filtered = products
    .filter((p) =>
      `${p.name} ${p.brand} ${p.sku} ${p.category} ${p.finish || ""}`
        .toLowerCase()
        .includes(q),
    )
    .filter((p) => categories.length === 0 || categories.includes(p.category))
    .filter((p) => finishes.length === 0 || finishes.includes(p.finish))
    .filter(
      (p) =>
        prices.length === 0 ||
        PRICES.some((r) => prices.includes(r.label) && r.test(p.price)),
    );

  // 2. Sort
  const sorted = [...filtered];
  if (sort === "low") sorted.sort((a, b) => a.price - b.price);
  if (sort === "high") sorted.sort((a, b) => b.price - a.price);
  if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));

  // 3. Paginate
  const pageCount = Math.ceil(sorted.length / PAGE_SIZE);
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="products" ref={rootRef}>
      <style>{css}</style>

      {/* Hero */}
      <section
        className="hero"
        onMouseMove={onHeroMove}
        onMouseLeave={onHeroLeave}
      >
        <Doodle name="blob" className="dd-blob" />
        <Doodle name="blobSand" className="dd-blob2" />
        <Doodle name="cherry" className="dd-cherry float" />
        <Doodle name="lipstick" className="dd-lip" />
        <Doodle name="sparkle" className="dd-sp1 float" />
        <Doodle name="sparkle" className="dd-sp2 float" />
        <Doodle name="sparkle" className="dd-sp3 float" />
        <Doodle name="squiggle" className="dd-sq" />
        <Doodle name="flower" className="dd-flower spin" />
        <Doodle name="heart" className="dd-h1 float" />
        <Doodle name="heart" className="dd-h2 float" />

        <div className="wrap">
          <p className="eyebrow">The color collection</p>
          <h1>
            Color, edited with{" "}
            <span className="scribble">
              care.
              <svg
                viewBox="0 0 200 16"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  pathLength="1"
                  vectorEffect="non-scaling-stroke"
                  d="M3 11C40 3 78 3 110 8s58 4 87-3"
                />
              </svg>
            </span>
          </h1>
          <p className="lead">
            Discover intuitive color, effortless application, and sensorial
            textures made for your daily makeup ritual.
          </p>

          <div className="toolbar">
            <div className="search">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5f5852"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="text"
                name="search"
                aria-label="Search products"
                placeholder="Search by name, brand or category"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="sort">
              <select
                name="sort"
                aria-label="Sort products"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="best">Sort: Bestselling</option>
                <option value="low">Sort: Price, low to high</option>
                <option value="high">Sort: Price, high to low</option>
                <option value="name">Sort: Name A–Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + products */}
      <div className="wrap layout">
        <aside className={showFilters ? "sidebar open" : "sidebar"}>
          <div className="filters-head">
            <h3>Filters</h3>
            <button className="clear" onClick={clearAll}>
              Clear all
            </button>
          </div>

          <FilterGroup
            title="Category"
            name="category"
            allLabel="All products"
            options={categoryNames}
            selected={categories}
            onToggle={(v) => toggle(categories, setCategories, v)}
            onClear={() => setCategories([])}
          />
          <FilterGroup
            title="Price"
            name="price"
            allLabel="All prices"
            options={PRICES.map((r) => r.label)}
            selected={prices}
            onToggle={(v) => toggle(prices, setPrices, v)}
            onClear={() => setPrices([])}
          />
          {finishNames.length > 0 && (
            <FilterGroup
              title="Finish"
              name="finish"
              allLabel="All finishes"
              options={finishNames}
              selected={finishes}
              onToggle={(v) => toggle(finishes, setFinishes, v)}
              onClear={() => setFinishes([])}
            />
          )}

          <div className="side-note">
            <Doodle name="sparkle" className="float" />
            <strong>A little extra</strong>
            <p>
              Complimentary samples with every order, and free shipping over
              $75.
            </p>
          </div>
        </aside>

        <main className="content">
          {/* Shown only on tablets and phones */}
          <button
            className="filters-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide filters" : "Show filters"}
          </button>

          <div className="topbar">
            <span>{sorted.length} products</span>
            <span className="ship">Complimentary shipping over $75</span>
          </div>

          {visible.length === 0 ? (
            <div className="empty">
              <Doodle name="cherry" className="static float" />
              <p>No products match your filters.</p>
            </div>
          ) : (
            <div className="grid">
              {visible.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <div className="pages">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={n === page ? "active" : ""}
                  aria-current={n === page ? "page" : undefined}
                  onClick={() => goToPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                aria-label="Next page"
                disabled={page === pageCount}
                onClick={() => goToPage(Math.min(page + 1, pageCount))}
              >
                →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
