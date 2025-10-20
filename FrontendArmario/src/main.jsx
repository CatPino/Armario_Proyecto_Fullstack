import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MantenerSesion } from "../../componentes/MantenerSesion/MantenerSesion"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantenerSesion>
      <App />
    </MantenerSesion>
  </StrictMode>
);