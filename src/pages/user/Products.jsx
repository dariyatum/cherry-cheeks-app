import { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../../data/products";

const CATEGORIES = ["Face", "Eyes", "Lips"];
const FINISHES = ["Matte", "Satin", "Dewy", "Shimmer"];
const PRICES = [
  { label: "Under $25", test: (p) => p < 25 },
  { label: "$25–$50", test: (p) => p >= 25 && p <= 50 },
  { label: "$50+", test: (p) => p > 50 },
];
const PAGE_SIZE = 12;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Inter:wght@400;500;600;700&display=swap');

.products { background: #faf7f2; color: #2b2420; font-family: 'Inter', sans-serif; text-align: left; }
.wrap { max-width: 1296px; margin: 0 auto; padding: 0 24px; }

/* Hero */
.hero { padding: 64px 0 32px; border-bottom: 1px solid #e8e1d8; }
.eyebrow { margin: 0 0 16px; font: 600 12px 'Inter', sans-serif; letter-spacing: 0.18em; text-transform: uppercase; color: #8a3050; }
.hero h1 { margin: 0 0 16px; font: 500 clamp(40px, 6vw, 64px)/1.1 'Cormorant Garamond', serif; }
.lead { max-width: 600px; margin: 0 0 32px; font-size: 15px; line-height: 1.6; color: #5f5852; }

/* Search + sort */
.toolbar { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; }
.search { position: relative; flex: 1 1 280px; max-width: 430px; }
.search svg { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); }
.search input { width: 100%; box-sizing: border-box; padding: 16px 20px 16px 46px; border: 1px solid #e2d9cf; border-radius: 999px; background: #fdfbf8; font: 400 14px 'Inter', sans-serif; }
.sort select {
  appearance: none; padding: 16px 44px 16px 20px; border: 1px solid #e2d9cf; border-radius: 999px;
  background: #fdfbf8 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232b2420' stroke-width='3'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 18px center;
  font: 400 13px 'Inter', sans-serif; cursor: pointer;
}

/* Sidebar + content */
.layout { display: flex; gap: 40px; padding: 32px 0 64px; }
.sidebar { flex: 0 0 220px; }
.content { flex: 1; min-width: 0; }

.filters-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.filters-head h3 { margin: 0; font: 600 13px 'Inter', sans-serif; }
.clear { border: none; background: none; color: #8a3050; font-size: 11px; text-decoration: underline; cursor: pointer; }
.group { padding: 20px 0; }
.group + .group { border-top: 1px solid #e8e1d8; }
.group h4 { margin: 0 0 14px; font: 600 11px 'Inter', sans-serif; letter-spacing: 0.14em; text-transform: uppercase; }
.group label { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 13px; color: #5f5852; cursor: pointer; }
.group input { width: 16px; height: 16px; margin: 0; accent-color: #8a3050; }

/* Top bar */
.topbar { display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 12px; color: #5f5852; }
.ship { color: #5b7a5e; }

/* Grid + card */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 32px 20px; }
.card-link { text-decoration: none; color: inherit; }
.image-box { position: relative; aspect-ratio: 332 / 300; border-radius: 20px; overflow: hidden; background: #efe3d6; }
.image-box img { width: 100%; height: 100%; object-fit: cover; }
.badge { position: absolute; top: 12px; left: 12px; padding: 8px 14px; border-radius: 999px; background: white; color: #8a3050; font: 600 11px 'Inter', sans-serif; letter-spacing: 0.14em; text-transform: uppercase; }
.meta { margin: 14px 0 0; font: 400 10px 'Inter', sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #8d857d; }
.card-link h3 { margin: 4px 0 6px; font: 500 24px 'Cormorant Garamond', serif; }
.price { margin: 0; font: 700 14px 'Inter', sans-serif; }
.empty { padding: 48px 0; color: #5f5852; }

/* Pagination */
.pages { display: flex; justify-content: center; gap: 8px; margin-top: 48px; }
.pages button { width: 38px; height: 38px; border: 1px solid #e2d9cf; border-radius: 50%; background: white; font: 500 12px 'Inter', sans-serif; cursor: pointer; }
.pages button.active { background: #8a3050; border-color: #8a3050; color: white; }

/* Phones: filters go above the grid */
@media (max-width: 800px) {
  .layout { flex-direction: column; gap: 0; }
  .sidebar { flex: none; }
}
`;

// One block of checkboxes (Category, Price or Finish)
function FilterGroup({
  title,
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
          checked={selected.length === 0}
          onChange={onClear}
        />
        {allLabel}
      </label>
      {options.map((option) => (
        <label key={option}>
          <input
            type="checkbox"
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
        <img src={image} alt={name} />
        {badge && <span className="badge">{badge}</span>}
      </div>
      <p className="meta">Makeup · {category}</p>
      <h3>{name}</h3>
      <p className="price">${price}</p>
    </Link>
  );
}

export default function Products() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("best");
  const [categories, setCategories] = useState([]);
  const [prices, setPrices] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [page, setPage] = useState(1);

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

  // 1. Filter
  const q = search.toLowerCase();
  const filtered = products
    .filter((p) =>
      `${p.name} ${p.category} ${p.finish}`.toLowerCase().includes(q),
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
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="text"
                placeholder="Search by shade or finish"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="sort">
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
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
      <div
        className="wrap layout"
        style={{ paddingInline: "clamp(16px, 4vw, 24px)" }}
      >
        {" "}
        <aside className="sidebar">
          <div className="filters-head">
            <h3>Filters</h3>
            <button className="clear" onClick={clearAll}>
              Clear all
            </button>
          </div>

          <FilterGroup
            title="Category"
            allLabel="All products"
            options={CATEGORIES}
            selected={categories}
            onToggle={(v) => toggle(categories, setCategories, v)}
            onClear={() => setCategories([])}
          />
          <FilterGroup
            title="Price"
            allLabel="All prices"
            options={PRICES.map((r) => r.label)}
            selected={prices}
            onToggle={(v) => toggle(prices, setPrices, v)}
            onClear={() => setPrices([])}
          />
          <FilterGroup
            title="Finish"
            allLabel="All finishes"
            options={FINISHES}
            selected={finishes}
            onToggle={(v) => toggle(finishes, setFinishes, v)}
            onClear={() => setFinishes([])}
          />
        </aside>
        <main className="content">
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
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(Math.min(page + 1, pageCount))}>
                →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
