import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Homepage from "@/modules/homepage/page";
import DashboardPage from "@/modules/dashboard/page";
import InventoryPage from "@/modules/inventory/page";
import UsagePage from "@/modules/usage/page";
import NotFoundPage from "@/modules/notfound/page";
import RouteError from "@/components/RouteError";

// StokCerdas Module Pages
import StokCerdasPage from "@/modules/stok-cerdas/page";
import StokCerdasDashboardPage from "@/modules/stok-cerdas/dashboard/page";
import StokCerdasInventoryListPage from "@/modules/stok-cerdas/inventory-list/page";
import StokCerdasIngredientDetailPage from "@/modules/stok-cerdas/ingredient-detail/page";
import StokCerdasAddUsagePage from "@/modules/stok-cerdas/add-usage/page";
import StokCerdasBarcodeScannerPage from "@/modules/stok-cerdas/barcode-scanner/page";
import StokCerdasRestockOrdersPage from "@/modules/stok-cerdas/restock-orders/page";

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
    // StokCerdas Routes
    {
      path: "/stok-cerdas",
      element: <StokCerdasPage />,
      errorElement: <RouteError />,
    },
    {
      path: "/stok-cerdas/dashboard",
      element: <StokCerdasDashboardPage />,
      errorElement: <RouteError />,
    },
    {
      path: "/stok-cerdas/inventory-list",
      element: <StokCerdasInventoryListPage />,
      errorElement: <RouteError />,
    },
    {
      path: "/stok-cerdas/ingredient-detail",
      element: <StokCerdasIngredientDetailPage />,
      errorElement: <RouteError />,
    },
    {
      path: "/stok-cerdas/add-usage",
      element: <StokCerdasAddUsagePage />,
      errorElement: <RouteError />,
    },
    {
      path: "/stok-cerdas/barcode-scanner",
      element: <StokCerdasBarcodeScannerPage />,
      errorElement: <RouteError />,
    },
    {
      path: "/stok-cerdas/restock-orders",
      element: <StokCerdasRestockOrdersPage />,
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
