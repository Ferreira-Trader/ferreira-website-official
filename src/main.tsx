import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NeuronPage } from "./pages/NeuronPage";
import { FerreiraFlixPage } from "./pages/FerreiraFlixPage";
import { FerreiraFlixV2Page } from "./pages/FerreiraFlixV2Page";
import { FerreiraFlixV3Page } from "./pages/FerreiraFlixV3Page";
import { FerreiraFlixObrigadoPage } from "./pages/FerreiraFlixObrigadoPage";
import "../tailwind.css";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/neuron" element={<NeuronPage />} />
        <Route path="/ferreiraflix" element={<FerreiraFlixPage />} />
        <Route path="/ferreiraflix-v2" element={<FerreiraFlixV2Page />} />
        <Route path="/ferreiraflix-v3" element={<FerreiraFlixV3Page />} />
        <Route path="/ferreiraflix/obrigado" element={<FerreiraFlixObrigadoPage />} />
        <Route path="*" element={null} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
