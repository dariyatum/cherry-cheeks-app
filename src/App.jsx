import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Contact from "./pages/Contact";

function App() {
  return (
    <Routes>
      {/* Pages WITH navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Pages WITHOUT navbar */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
