import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom"; // On importe le moteur de navigation

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* On enveloppe toute l'app pour que la navigation fonctionne partout */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
