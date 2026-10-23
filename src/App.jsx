import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products"
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
  return (
    <Routes>
      {/* Pages WITH navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Route>

      {/* Pages WITHOUT navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register/>} />
    </Routes>
  );
}

export default App;