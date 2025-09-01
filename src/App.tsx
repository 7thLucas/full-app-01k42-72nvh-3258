import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Homepage from "@/modules/homepage/page";
import DashboardPage from "@/modules/dashboard/page";
import InventoryPage from "@/modules/inventory/page";
import UsagePage from "@/modules/usage/page";
import NotFoundPage from "@/modules/notfound/page";
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
      element: <Homepage />,
      errorElement: <RouteError />,
    },
    {
      path: "/dashboard",
      element: <DashboardPage />,
      errorElement: <RouteError />,
    },
    {
      path: "/inventory",
      element: <InventoryPage />,
      errorElement: <RouteError />,
    },
    {
      path: "/usage",
      element: <UsagePage />,
      errorElement: <RouteError />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
      errorElement: <RouteError />,
    },
  ],
  { basename },
);

export default function App() {
  return <RouterProvider router={router} />;
}
