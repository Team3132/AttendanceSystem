import { createBrowserRouter } from "react-router-dom";
import RouterErrorPage from "./pages/RouterErrorPage";

const router = createBrowserRouter([
  {
    errorElement: <RouterErrorPage />,
    children: [
      {
        path: "/error",
        lazy: () => import("./pages/QueryErrorPage"),
      },
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
            lazy: () => import("./features/outreach/pages/OutreachHome"),
          },
          {
            path: "/events",
            children: [
              {
                index: true,
                lazy: () => import("./features/events/pages/EventsHome"),
              },
              {
                path: "create",
                lazy: () => import("./features/events/pages/EventCreate"),
              },
              {
                path: ":eventId",
                lazy: () => import("./features/events/pages/EventPage"),
                children: [
                  {
                    index: true,
                    lazy: () => import("./features/events/pages/EventDetails"),
                  },
                  {
                    path: "check-in",
                    lazy: () => import("./features/events/pages/EventCheckin"),
                  },
                  {
                    path: "qr-code",
                    lazy: () => import("./features/events/pages/EventQRCode"),
                  },
                ],
              },
            ],
          },
          {
            path: "/profile",
            lazy: () => import("./features/user/pages/ProfilePage"),
            children: [
              {
                index: true,
                lazy: () => import("./features/user/pages/ScancodePage"),
              },
              {
                path: "pending",
                lazy: () => import("./features/user/pages/PendingEventsPage"),
              }
            ],
          },
          {
            path: "/user/:userId",
            lazy: () => import("./features/user/pages/ProfilePage"),
            children: [
              {
                index: true,
                lazy: () => import("./features/user/pages/ScancodePage"),
              },
              {
                path: "pending",
                lazy: () => import("./features/user/pages/PendingEventsPage"),
              }
            ],
          },
          {
            path: "/admin",
            lazy: () => import("./features/admin/pages/AdminHome"),
          },
        ],
      },
    ],
  },
]);

export default router;
