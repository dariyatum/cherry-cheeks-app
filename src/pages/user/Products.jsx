import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../data/useProducts";

const PRICES = [
  { label: "Under $10", test: (p) => p < 10 },
  { label: "$10–$20", test: (p) => p >= 10 && p <= 20 },
  { label: "$20+", test: (p) => p > 20 },
];
const PAGE_SIZE = 8; // 12 products make 2 pages

// Every rule starts with ".products" so it cannot clash with your teammates' CSS
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Inter:wght@400;500;600;700&display=swap');

.products { background: #faf7f2; color: #2b2420; font-family: 'Inter', sans-serif; text-align: left; }
.products *, .products *::before, .products *::after { box-sizing: border-box; }
.products .wrap { max-width: 1296px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }

/* Hero */
.products .hero { padding: 64px 0 32px; border-bottom: 1px solid #e8e1d8; }
.products .eyebrow { margin: 0 0 16px; font: 600 12px 'Inter', sans-serif; letter-spacing: 0.18em; text-transform: uppercase; color: #8a3050; }
.products .hero h1 { margin: 0 0 16px; font: 500 clamp(40px, 6vw, 64px)/1.1 'Cormorant Garamond', serif; }
.products .lead { max-width: 600px; margin: 0 0 32px; font-size: 15px; line-height: 1.6; color: #5f5852; }

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
.products .layout { display: flex; gap: 40px; padding-top: 32px; padding-bottom: 64px; }
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

/* Tablets and phones: filters collapse behind a button */
@media (max-width: 900px) {
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
  .products .hero { padding: 40px 0 24px; }
  .products .toolbar { flex-direction: column; }
  .products .search { max-width: none; flex: none; }
  .products .sort select { width: 100%; }
  .products .grid { gap: 24px 14px; }
  .products .card-link h3 { font-size: 20px; }
}

@media (prefers-reduced-motion: reduce) {
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
    <div className="products">
      <style>{css}</style>

      {/* Hero */}
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">The color collection</p>
          <h1>Color, edited with care.</h1>
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
            <p className="empty">No products match your filters.</p>
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
