import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

// Get base path from qbid.txt
let basePath = import.meta.env.VITE_BASE_PATH;

// Make sure its prefixed and suffixed with a slash
basePath = basePath.startsWith("/") ? basePath : `/${basePath}`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basePath}>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
