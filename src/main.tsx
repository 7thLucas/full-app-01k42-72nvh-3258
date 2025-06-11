import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import "@/globals.css";

import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
      <HeroUIProvider>
        <ToastProvider placement="top-right" toastOffset={10} />
        <App />
      </HeroUIProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
