import { Link } from "react-router-dom";

function ProductCard({ image, category, name, price, badge, to = "/products" }) {
  return (
    <Link
      to={to}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry"
    >
      <div className="relative aspect-[5/6] overflow-hidden rounded-xl bg-blush">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cherry">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-widest text-gray-500">
        {category}
      </p>
      <h3 className="font-display text-xl text-gray-900">{name}</h3>
      <p className="mt-1 text-sm font-semibold text-gray-900">{price}</p>
    </Link>
  );
}

export default ProductCard;