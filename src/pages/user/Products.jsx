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

.products { font-family: 'Inter', sans-serif; }
.products .dd { position:absolute; z-index:1; width:var(--w,80px); pointer-events:none; will-change:transform; transform:translate3d(calc(var(--mx,0)*var(--px,0)*1px),calc(var(--sy,0)*var(--s,0)*1px + var(--my,0)*var(--py,0)*1px),0) rotate(var(--r,0deg)); transition:transform .25s ease-out; }
.products .dd svg { display:block; width:100%; height:auto; overflow:visible; }
.products .dd.float svg { animation:pr-float 6s ease-in-out infinite; }
.products .dd.spin svg { animation:pr-spin 40s linear infinite; }
.products .dd.static { position:relative; display:block; margin:0 0 12px; --w:84px; }
.products .dd-blob { --w:560px; right:-120px; top:-100px; z-index:0; --s:.22; --px:14; --py:10; }
.products .dd-blob2 { --w:380px; left:-150px; bottom:-150px; z-index:0; --s:.1; --px:-10; --py:-8; }
.products .dd-cherry { --w:170px; right:8%; top:30px; --r:8deg; --s:.12; --px:-22; --py:-14; }
.products .dd-lip { --w:62px; right:27%; bottom:40px; --r:-16deg; --s:-.06; --px:30; --py:20; }
.products .dd-sp1 { --w:38px; right:4%; top:250px; --s:-.1; --px:-40; --py:26; }
.products .dd-sp2 { --w:26px; right:36%; top:60px; --s:-.14; --px:24; --py:-22; }
.products .dd-sp3 { --w:30px; right:19%; bottom:14px; --s:.08; --px:-18; --py:14; }
.products .dd-sq { --w:120px; right:25%; top:150px; --r:-6deg; --s:.05; --px:18; --py:10; }
.products .dd-flower { --w:64px; right:3%; bottom:46px; --s:-.05; --px:-26; --py:18; }
.products .dd-h1 { --w:26px; right:21%; top:218px; --r:-14deg; --s:-.09; --px:22; --py:-16; }
.products .dd-h2 { --w:20px; right:33%; bottom:100px; --r:12deg; --s:.07; --px:-14; --py:12; }
.products .scribble { position:relative; display:inline-block; }
.products .scribble svg { position:absolute; left:-2%; bottom:-.14em; width:104%; height:.3em; overflow:visible; }
.products .scribble path { fill:none; stroke:#8a3050; stroke-width:3; stroke-linecap:round; stroke-dasharray:1; stroke-dashoffset:1; animation:pr-draw 1.1s .5s ease forwards; }
@keyframes pr-float { 0%,100% { transform:translateY(0) rotate(0); } 50% { transform:translateY(-10px) rotate(4deg); } }
@keyframes pr-spin { to { transform:rotate(360deg); } }
@keyframes pr-draw { to { stroke-dashoffset:0; } }
@media (max-width:1100px) { .products .dd-sq,.products .dd-h2 { display:none; } .products .dd-cherry { --w:140px; } }
@media (max-width:900px) { .products .dd-lip,.products .dd-flower,.products .dd-h1,.products .dd-sp3 { display:none; } .products .dd-blob { --w:400px; right:-120px; top:-70px; } .products .dd-cherry { --w:120px; right:4%; top:24px; } }
@media (max-width:600px) { .products .dd-blob2,.products .dd-sp2 { display:none; } .products .dd-blob { --w:300px; right:-110px; top:-60px; } .products .dd-cherry { --w:84px; right:2%; top:10px; } .products .dd-sp1 { --w:26px; right:6%; top:150px; } }
@media (prefers-reduced-motion:reduce) { .products .dd { transform:rotate(var(--r,0deg)); transition:none; } .products .dd svg { animation:none!important; } .products .scribble path { animation:none; stroke-dashoffset:0; } }
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
    <div className="border-b border-[#e8e1d8] py-5 last:border-b-0">
      <h4 className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.14em]">
        {title}
      </h4>
      <label className="mb-3 flex cursor-pointer items-center gap-2.5 text-[13px] text-[#5f5852]">
        <input
          type="checkbox"
          className="m-0 h-4 w-4 accent-[#8a3050]"
          name={`${name}-all`}
          checked={selected.length === 0}
          onChange={onClear}
        />
        {allLabel}
      </label>
      {options.map((option) => (
        <label
          key={option}
          className="mb-3 flex cursor-pointer items-center gap-2.5 text-[13px] text-[#5f5852]"
        >
          <input
            type="checkbox"
            className="m-0 h-4 w-4 accent-[#8a3050]"
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
    <Link to={`/product/${id}`} className="block text-inherit no-underline">
      <div className="relative aspect-[332/300] overflow-hidden rounded-[20px] bg-[#efe3d6]">
        {image && (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
        )}
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[#8a3050]">
            {badge}
          </span>
        )}
      </div>
      {category && (
        <p className="mb-0 mt-3.5 text-[10px] uppercase tracking-[0.14em] text-[#8d857d]">
          {category}
        </p>
      )}
      <h3 className="mb-1.5 mt-1 font-[Cormorant_Garamond,serif] text-2xl font-medium leading-tight">
        {name}
      </h3>
      <p className="m-0 text-sm font-bold">${Number(price).toFixed(2)}</p>
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

  if (loading) return <p className="p-10">Loading products…</p>;
  if (error) return <p className="p-10">Could not load products: {error}</p>;

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
    <div
      className="products relative overflow-x-clip bg-[#faf7f2] text-left text-[#2b2420]"
      ref={rootRef}
    >
      <style>{css}</style>

      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-[#e8e1d8] pb-8 pt-14 sm:pb-16 sm:pt-[88px]"
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

        <div className="relative z-[2] mx-auto max-w-[1296px] px-4 sm:px-6">
          <p className="mb-[18px] text-xs font-semibold uppercase tracking-[0.18em] text-[#8a3050]">
            The color collection
          </p>
          <h1 className="mb-5 max-w-[12ch] font-[Cormorant_Garamond,serif] text-[clamp(48px,8.5vw,104px)] font-medium leading-none tracking-[-0.015em]">
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
          <p className="mb-8 max-w-[520px] text-base leading-[1.7] text-[#5f5852]">
            Discover intuitive color, effortless application, and sensorial
            textures made for your daily makeup ritual.
          </p>

          <div className="flex flex-wrap justify-between gap-4 max-[600px]:flex-col">
            <div className="relative w-full max-w-[430px] flex-[1_1_280px] max-[600px]:max-w-none max-[600px]:flex-none">
              <svg
                className="pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2"
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
                className="w-full rounded-full border border-[#e2d9cf] bg-[#fdfbf8] py-4 pl-[46px] pr-5 text-sm text-[#2b2420] outline-none focus:ring-2 focus:ring-[#8a3050]"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="relative">
              <select
                name="sort"
                aria-label="Sort products"
                className="cursor-pointer appearance-none rounded-full border border-[#e2d9cf] bg-[#fdfbf8] py-4 pl-5 pr-11 text-[13px] text-[#2b2420] outline-none focus:ring-2 focus:ring-[#8a3050] max-[600px]:w-full"
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
      <div className="relative z-[2] mx-auto flex max-w-[1296px] gap-10 px-4 pb-16 pt-8 sm:px-6 max-[900px]:flex-col max-[900px]:gap-0 max-[900px]:pt-6">
        <aside
          className={`${showFilters ? "block" : "hidden"} w-[200px] shrink-0 max-[900px]:mb-6 max-[900px]:w-full ${showFilters ? "max-[900px]:block" : "max-[900px]:hidden"} min-[901px]:block`}
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[13px] font-semibold">Filters</h3>
            <button
              className="cursor-pointer border-0 bg-transparent text-[11px] text-[#8a3050] underline"
              onClick={clearAll}
            >
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

          <div className="relative mt-3 overflow-hidden rounded-[20px] bg-[#f3dedb] px-[18px] pb-5 pt-[22px]">
            <Doodle name="sparkle" className="float" />
            <strong className="mb-1 block font-[Cormorant_Garamond,serif] text-xl font-medium leading-tight text-[#8a3050]">
              A little extra
            </strong>
            <p className="text-xs leading-[1.5] text-[#6b4a52]">
              Complimentary samples with every order, and free shipping over
              $75.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {/* Shown only on tablets and phones */}
          <button
            className="mb-4 hidden w-full cursor-pointer rounded-full border border-[#e2d9cf] bg-white p-3.5 text-[13px] font-medium text-[#2b2420] max-[900px]:block"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide filters" : "Show filters"}
          </button>

          <div className="mb-6 flex flex-wrap justify-between gap-2 text-xs text-[#5f5852]">
            <span>{sorted.length} products</span>
            <span className="text-[#5b7a5e]">
              Complimentary shipping over $75
            </span>
          </div>

          {visible.length === 0 ? (
            <div className="py-12 text-[#5f5852]">
              <Doodle name="cherry" className="static float" />
              <p>No products match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-5 gap-y-8 max-[600px]:gap-x-3.5 max-[600px]:gap-y-6">
              {visible.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`h-[38px] w-[38px] cursor-pointer rounded-full border text-xs font-medium ${n === page ? "border-[#8a3050] bg-[#8a3050] text-white" : "border-[#e2d9cf] bg-white text-[#2b2420]"}`}
                  aria-current={n === page ? "page" : undefined}
                  onClick={() => goToPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                aria-label="Next page"
                className="h-[38px] w-[38px] rounded-full border border-[#e2d9cf] bg-white text-xs disabled:cursor-default disabled:opacity-40"
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
