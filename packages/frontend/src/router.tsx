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
        ],
      },
      {
        path: "/admin",
        lazy: () => import("./features/admin/pages/AdminHome"),
      },
    ],
  },
]);

export default router;
