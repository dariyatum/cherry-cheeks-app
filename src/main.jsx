import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Ensure this import is present


import App from "./App";

import "./styles/global.css";
import "./index.css";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode> 
    <AuthProvider> 
      <BrowserRouter> 
        <App /> 
      </BrowserRouter> 
    </AuthProvider> 
  </StrictMode> 
);
