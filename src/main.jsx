import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 💡 Verifica que el div exista antes de renderizar
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("❌ No se encontró el elemento #root en index.html");
}
