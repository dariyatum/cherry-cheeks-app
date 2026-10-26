import React from "react";

export default function ProductCard({ name, price, imageUrl, status }) {
  const priceNumber = Number(price);

  return (
    <div className="product-card">
      <span className="product-card__status">{status}</span>
      <img src={imageUrl} alt={name} className="product-card__image" />
      <h3>{name}</h3>
      <p>{Number.isNaN(priceNumber) ? "—" : `$${priceNumber.toFixed(2)}`}</p>
    </div>
  );
}
