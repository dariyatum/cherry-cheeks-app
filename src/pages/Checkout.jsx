import React from "react";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../components/OrderSummary";

// ---------- 1. CSS (internal) ----------
const styles = `
  .checkout-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 40px 24px;
    background: #faf6f1;
  }
`;

// ---------- 2. Product data ----------
// Change these to change what shows in the box.
const products = [
  { id: 1, name: "Botanical Dew Serum", detail: "30 ml", qty: 1, price: 48, color: "#c9955c" },
  { id: 2, name: "Cloud Soft Moisturiser", detail: "50 ml", qty: 1, price: 42, color: "#e3cdb0" },
  { id: 3, name: "Petal Lip Tint", detail: "Rosewood · 4 g", qty: 2, price: 24, color: "#a8576d" },
];

// ---------- 3. The page ----------
function CheckoutPage() {
  // This lets us move to another page
  const navigate = useNavigate();

  function goToBilling() {
    navigate("/billing");
  }

  return (
    <>
      <style>{styles}</style>

      <div className="checkout-page">
        {/* We send data to the component using props */}
        <OrderSummary
          items={products}
          deliveryFee={0}
          buttonLabel="Continue to billing & shipping"
          onContinue={goToBilling}
        />
      </div>
    </>
  );
}

export default CheckoutPage;