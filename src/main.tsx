import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import "@/globals.css";

import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider placement="top-right" toastOffset={10} />
      <App />
    </HeroUIProvider>
  </React.StrictMode>,
);
