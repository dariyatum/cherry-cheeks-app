import { useNavigate, useLocation } from "react-router-dom";
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

  const handleClick = () => {
    // Not logged in → login, then come back to this page
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }

    addItem(product, qty);
    if (goToCart) navigate("/cart");
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}