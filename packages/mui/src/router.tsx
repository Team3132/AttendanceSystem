import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    lazy: () => import("./features/auth/pages/LoginPage"),
  },
  {
    lazy: () => import("./templates/NavigationWrapper"),
    children: [
      {
        index: true,
        lazy: () => import("./pages/HomePage"),
      },
      {
        path: "/outreach",
        Component: null,
      },
      {
        path: "/events",
        Component: null,
      },
      {
        path: "/profile",
        Component: null,
      },
      {
        path: "/admin",
        Component: null,
      },
    ],
  },
]);

export default router;
