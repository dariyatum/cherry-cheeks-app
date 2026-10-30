import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/MainLayout";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import ProductDetail from "./pages/user/ProductDetail";
import Payment from "./pages/user/Payment";
import OrderReview from "./pages/user/OrderReview";
import OrderConfirmation from "./pages/user/OrderConfirmation";
import Unauthorized from "./pages/user/Unauthorized";

import Login from "./pages/user/Login";
import Contact from "./pages/user/Contact";
import Cart from "./pages/user/Cart";
import BillingShipping from "./pages/user/BillingShipping";
import About from "./pages/user/About";
import Profile from "./pages/user/Profile";
import Register from "./pages/user/Register";

import AdminLayout from "./components/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminOrder from "./pages/admin/AdminOrder";

import AdminProducts from "./pages/admin/AdminProducts";
import AdminCustomers from "./pages/admin/AdminCustomers";
function App() {
  return (
    <Routes>
      {/* Admin layout*/}

      {/* Pages WITH navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/billingshipping" element={<BillingShipping />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orderreview" element={<OrderReview />} />
        <Route path="/orderconfirmation" element={<OrderConfirmation />} />
        <Route path="/about" element={<About />} />

        {/* Logged-in only */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Pages WITHOUT navbar */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin only: one guard covers every page inside */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/:category" element={<AdminProducts />} />
        <Route path="products" element={<h1 className="font-display text-3xl">Products</h1>} />
        <Route path="orders" element={<AdminOrder />} />
       
       <Route path="customers" element={<AdminCustomers />} />
      </Route>

      {/* Unknown URL → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;