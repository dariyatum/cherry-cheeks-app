import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";

import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import AdminLayout from "./components/AdminLayout";
function App() {
  return (
    <Routes>
      {/* Pages WITH navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Pages WITHOUT navbar */}
      <Route path="/login" element={<Login />} />
     

    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<h1 className="font-display text-3xl">Overview</h1>} />
      <Route path="products" element={<h1 className="font-display text-3xl">Products</h1>} />
      <Route path="orders" element={<h1 className="font-display text-3xl">Orders</h1>} />
      <Route path="customers" element={<h1 className="font-display text-3xl">Customers</h1>} />
    </Route>
    </Routes>
  );
}

export default App;