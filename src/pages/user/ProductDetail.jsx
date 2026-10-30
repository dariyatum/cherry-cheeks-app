import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../../data/useProducts";
import AddToCartButton from "../../components/AddToCartButton";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Inter:wght@400;500;600;700&display=swap');

.detail { background: #faf7f2; color: #2b2420; font-family: 'Inter', sans-serif; text-align: left; }
.wrap { max-width: 1296px; margin: 0 auto; padding: 24px 24px 80px; }

.crumbs { margin-bottom: 20px; font-size: 11px; color: #8d857d; }
.crumbs a { color: #8d857d; text-decoration: none; }
.crumbs strong { color: #2b2420; font-weight: 500; }

/* Two columns: gallery | info */
.body { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 56px; }

/* Gallery */
.gallery { display: flex; gap: 16px; }
.thumbs { display: flex; flex-direction: column; gap: 12px; overflow-x: auto; }
.thumb { width: 84px; height: 100px; padding: 0; border: 2px solid transparent; border-radius: 14px; overflow: hidden; background: none; cursor: pointer; flex: none; }
.thumb.active { border-color: #8a3050; }
.thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.main { position: relative; flex: 1; aspect-ratio: 602 / 720; border-radius: 28px; overflow: hidden; background: #efe3d6; }
.main img { width: 100%; height: 100%; object-fit: cover; display: block; }
.expand { position: absolute; right: 16px; bottom: 16px; width: 42px; height: 42px; border: none; border-radius: 50%; background: white; cursor: pointer; }

/* Info */
.tagline { margin: 0 0 8px; font: 600 11px 'Inter', sans-serif; letter-spacing: 0.16em; text-transform: uppercase; color: #8a3050; }
.info h1 { margin: 0 0 8px; font: 500 clamp(36px, 5vw, 52px)/1.1 'Cormorant Garamond', serif; }
.rating { display: flex; gap: 8px; align-items: center; font-size: 11px; color: #5f5852; }
.stars { color: #8a3050; letter-spacing: 2px; }
.rating u { text-underline-offset: 2px; }
.price { margin: 24px 0 20px; font-size: 20px; }
.desc { margin: 0 0 28px; font-size: 15px; line-height: 1.7; color: #5f5852; }

.label { margin: 0 0 12px; font: 700 11px 'Inter', sans-serif; letter-spacing: 0.12em; text-transform: uppercase; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
.chip { padding: 8px 14px; border-radius: 999px; background: #f6e3e3; color: #8a3050; font: 500 11px 'Inter', sans-serif; }
.shade { padding: 12px 18px; border: 1px solid #e2d9cf; border-radius: 999px; background: white; font: 400 12px 'Inter', sans-serif; cursor: pointer; }
.shade.active { border-color: #8a3050; color: #8a3050; }

/* Quantity + add to cart */
.buy { display: flex; gap: 12px; margin-bottom: 24px; }
.qty { display: flex; align-items: center; border: 1px solid #e2d9cf; border-radius: 999px; background: white; }
.qty button { width: 44px; height: 48px; border: none; background: none; font-size: 16px; cursor: pointer; }
.qty span { min-width: 20px; text-align: center; font-size: 13px; }
.add { flex: 1; border: none; border-radius: 999px; background: #8a3050; color: white; font: 500 13px 'Inter', sans-serif; letter-spacing: 0.04em; cursor: pointer; }

/* Perks */
.perks { display: grid; gap: 14px; margin-bottom: 32px; font-size: 12px; color: #5f5852; }
.perk { display: flex; align-items: center; gap: 10px; }

/* Accordion */
.acc { padding: 20px 0; border-bottom: 1px solid #e8e1d8; }
.acc-head { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0; border: none; background: none; font: 700 11px 'Inter', sans-serif; letter-spacing: 0.12em; text-transform: uppercase; color: #2b2420; cursor: pointer; }
.acc-head span:last-child { font-size: 18px; font-weight: 400; color: #8d857d; }
.acc p { margin: 12px 0 0; font-size: 12px; line-height: 1.7; color: #5f5852; }

/* Tablets and phones: stack, thumbnails go under the photo */
@media (max-width: 900px) {
  .body { grid-template-columns: 1fr; gap: 32px; }
  .gallery { flex-direction: column-reverse; }
  .thumbs { flex-direction: row; }
}

@media (max-width: 600px) {
  .wrap { padding: 16px 16px 56px; }
  .body { gap: 24px; }
  .main { border-radius: 20px; }
  .thumb { width: 64px; height: 76px; }
  .desc { font-size: 14px; }
  .add { font-size: 12px; }
}
`;

// Small line icon used by the perks list
function Icon({ children }) {
  return (
    <svg
      width="16"
      height="16"
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

// Show 42 instead of 42.00, but keep 29.50
const fmt = (n) => (Number.isInteger(n) ? n : n.toFixed(2));

export default function ProductDetail() {
  // Data from /student-data/products.json and categories.json
  const { products, loading, error } = useProducts();

  const { id } = useParams();

  const [imageIndex, setImageIndex] = useState(0);
  const [shade, setShade] = useState(null);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState({ apply: true, shades: true, range: true });

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
  if (error)
    return <p style={{ padding: 40 }}>Could not load products: {error}</p>;

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <p style={{ padding: 40 }}>
        Product not found. <Link to="/products">Back to products</Link>
      </p>
    );
  }

  // Fallbacks so products without the extra fields still work
  const images = product.images?.length ? product.images : [product.image];
  const shades = product.shades || [];
  const selectedShade = shade || shades[0];

  const sections = [
    { key: "apply", title: "How to apply", text: product.howToApply },
    { key: "shades", title: "Full shades", text: shades.join(", ") },
    { key: "range", title: "Shade range", text: product.shadeRange },
  ].filter((s) => s.text); // hide empty sections

  function toggle(key) {
    setOpen({ ...open, [key]: !open[key] });
  }

  return (
    <div className="detail">
      <style>{css}</style>

      <div className="wrap">
        <p className="crumbs">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> /{" "}
          <strong>{product.name}</strong>
        </p>

        <div className="body">
          {/* Gallery */}
          <div className="gallery">
            <div className="thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={i === imageIndex ? "thumb active" : "thumb"}
                  onClick={() => setImageIndex(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>

            <div className="main">
              <img src={images[imageIndex]} alt={product.name} />
              <button className="expand" aria-label="Expand image">
                ⤢
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="info">
            {product.tagline && <p className="tagline">{product.tagline}</p>}
            <h1>{product.name}</h1>

            {product.rating && (
              <div className="rating">
                <span className="stars">★★★★★</span>
                <u>
                  {product.rating} · {product.reviews} reviews
                </u>
              </div>
            )}

            <p className="price">${product.price.toFixed(2)}</p>
            <p className="desc">{product.description}</p>

            {shades.length > 0 && (
              <>
                <p className="label">Key shades</p>
                <div className="chips">
                  {shades.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>

                <p className="label">Shade</p>
                <div className="chips">
                  {shades.map((s) => (
                    <button
                      key={s}
                      className={s === selectedShade ? "shade active" : "shade"}
                      onClick={() => setShade(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="buy">
              <div className="qty">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)}>+</button>
              </div>

              <AddToCartButton product={product} qty={qty} className="add">
                  Add to cart · ${fmt(product.price * qty)} →
              </AddToCartButton>
            </div>

            <div className="perks">
              <div className="perk">
                <Icon>
                  <path d="M1 6h13v10H1zM14 10h4l3 3v3h-7" />
                  <circle cx="6" cy="18" r="2" />
                  <circle cx="17" cy="18" r="2" />
                </Icon>
                Free shipping on orders over $75
              </div>
              <div className="perk">
                <Icon>
                  <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
                </Icon>
                30-day returns
              </div>
              <div className="perk">
                <Icon>
                  <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
                </Icon>
                Complimentary samples with every order
              </div>
            </div>

            {sections.map((s) => (
              <div className="acc" key={s.key}>
                <button className="acc-head" onClick={() => toggle(s.key)}>
                  <span>{s.title}</span>
                  <span>{open[s.key] ? "−" : "+"}</span>
                </button>
                {open[s.key] && <p>{s.text}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}