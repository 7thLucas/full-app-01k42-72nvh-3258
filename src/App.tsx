import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import RouteError from "@/components/RouteError";

// Check if we're running locally and set basename accordingly
const isLocalhost =
  window.location.origin.includes("localhost") ||
  window.location.origin.includes("0.0.0.0") ||
  window.location.origin.includes("127.0.0.1");
const basename = isLocalhost ? import.meta.env.VITE_BASE_PATH : undefined;

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
      errorElement: <RouteError />,
    },
    {
      path: "*",
      element: <NotFound />,
      errorElement: <RouteError />,
    },
  ],
  { basename },
);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
