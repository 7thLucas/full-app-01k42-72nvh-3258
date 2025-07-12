import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import NewsList from "@/pages/NewsList";
import NewsDetail from "@/pages/NewsDetail";
import InformationList from "@/pages/InformationList";
import InformationDetail from "@/pages/InformationDetail";
import MiniAppDetail from "@/pages/MiniAppDetail";

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
    },
    {
      path: "/news",
      element: <NewsList />,
    },
    {
      path: "/news/:id",
      element: <NewsDetail />,
    },
    {
      path: "/information",
      element: <InformationList />,
    },
    {
      path: "/information/:id",
      element: <InformationDetail />,
    },
    {
      path: "/miniapps/:id",
      element: <MiniAppDetail />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  { basename },
);

export default function App() {
  return <RouterProvider router={router} />;
}
