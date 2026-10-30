import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function AddToCartButton({
  product,
  qty = 1,
  goToCart = false,
  className = "",
  children = "Add to cart",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // Hide the notification after 2.5 seconds
  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2500);
    return () => clearTimeout(timer);
  }, [added]);

  const handleClick = () => {
    // Not logged in → login, then come back to this page
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }

    addItem(product, qty);

    if (goToCart) {
      navigate("/cart");
    } else {
      setAdded(true); // show the notification instead
    }
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>

      {added && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "14px 22px",
            borderRadius: 999,
            background: "#8a3050",
            color: "white",
            fontSize: 14,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <span>✓ Added to your cart</span>
          <Link
            to="/cart"
            style={{ color: "white", textDecoration: "underline", fontWeight: 600 }}
          >
            View cart
          </Link>
        </div>
      )}
    </>
  );
}