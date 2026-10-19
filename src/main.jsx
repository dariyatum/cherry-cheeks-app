import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products/>} />
      </Route>
    </Routes>
  </BrowserRouter>
);