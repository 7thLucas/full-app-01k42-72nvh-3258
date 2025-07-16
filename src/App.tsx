import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import NewsList from "@/pages/NewsList";
import NewsDetail from "@/pages/NewsDetail";
import InformationList from "@/pages/InformationList";
import InformationDetail from "@/pages/InformationDetail";
import MiniAppDetail from "@/pages/MiniAppDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RouteError from "@/components/RouteError";
import { AuthProvider } from "@/contexts/AuthContext";

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
      path: "/login",
      element: <Login />,
      errorElement: <RouteError />,
    },
    {
      path: "/register",
      element: <Register />,
      errorElement: <RouteError />,
    },
    {
      path: "/news",
      element: <NewsList />,
      errorElement: <RouteError />,
    },
    {
      path: "/news/:id",
      element: <NewsDetail />,
      errorElement: <RouteError />,
    },
    {
      path: "/information",
      element: <InformationList />,
      errorElement: <RouteError />,
    },
    {
      path: "/information/:id",
      element: <InformationDetail />,
      errorElement: <RouteError />,
    },
    {
      path: "/miniapps/:id",
      element: <MiniAppDetail />,
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
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
