import { Link } from "react-router-dom";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Inter:wght@600;700&display=swap');

.product-card { display: block; width: 100%; color: #2b2420; text-align: left; text-decoration: none; }
.product-card__media { position: relative; aspect-ratio: 332 / 300; border-radius: 20px; overflow: hidden; background: #efe3d6; }
.product-card__image { display: block; width: 100%; height: 100%; object-fit: cover; }
.product-card__status {
  position: absolute; top: 12px; left: 12px; padding: 8px 14px; border-radius: 999px;
  background: #fff; color: #8a3050; font: 600 11px 'Inter', sans-serif;
  letter-spacing: 0.14em; text-transform: uppercase; line-height: 1;
}
.product-card__name { margin: 14px 0 6px; font: 500 24px/1.2 'Cormorant Garamond', serif; }
.product-card__price { margin: 0; font: 700 14px 'Inter', sans-serif; }

@media (max-width: 600px) {
  .product-card__name { font-size: 20px; }
}
`;

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  image,
  status,
  badge,
}) {
  const src = imageUrl || image;
  const label = status || badge;

  // "$48", "48.00" or 48 all become a number; anything unreadable is shown as it came
  const amount = Number(String(price).replace(/[^0-9.]/g, ""));
  const shown =
    String(price).trim() !== "" && Number.isFinite(amount)
      ? `$${amount.toFixed(2)}`
      : price;

  const content = (
    <>
      <style>{css}</style>

      <div className="product-card__media">
        {src && <img className="product-card__image" src={src} alt={name} />}
        {label && <span className="product-card__status">{label}</span>}
      </div>

      <h3 className="product-card__name">{name}</h3>
      <p className="product-card__price">{shown}</p>
    </>
  );

  // With an id the whole card links to its detail page
  return id !== undefined ? (
    <Link to={`/product/${id}`} className="product-card">
      {content}
    </Link>
  ) : (
    <div className="product-card">{content}</div>
  );
}
