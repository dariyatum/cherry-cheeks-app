import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";

import Login from "./pages/Login";


function App() {
  return (
    <Routes>
      {/* Pages WITH navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        
      </Route>

      {/* Pages WITHOUT navbar */}
      <Route path="/login" element={<Login />} />

    </Routes>
  );
}

export default App;