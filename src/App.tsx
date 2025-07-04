import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import Submissions from "./pages/Submissions";
import SubmissionDetail from "./pages/SubmissionDetail";
import SubmissionUpdate from "./pages/SubmissionUpdate";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/submissions",
      element: <Submissions />,
    },
    {
      path: "/submission/:id",
      element: <SubmissionDetail />,
    },
    {
      path: "/submission/update/:id",
      element: <SubmissionUpdate />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    basename: import.meta.env.VITE_BASE_PATH,
  },
);

export default function App() {
  return <RouterProvider router={router} />;
}
