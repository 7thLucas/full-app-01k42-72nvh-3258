// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import React from "react";
import ReactDOM from "react-dom/client";
import "@/globals.css";

import App from "./App.tsx";

import ErrorBoundary from "@/components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
