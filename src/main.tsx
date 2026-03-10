import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NeuronPage } from "./pages/NeuronPage";
import { FerreiraFlixPage } from "./pages/FerreiraFlixPage";
import "../tailwind.css";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/neuron" element={<NeuronPage />} />
        <Route path="/ferreiraflix" element={<FerreiraFlixPage />} />
        <Route path="*" element={null} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
