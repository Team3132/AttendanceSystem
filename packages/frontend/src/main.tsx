import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AuthWrapper } from "./features/auth";
import {
  AdminAttendancePage,
  AdminCheckinPage,
  AgendaPage,
  AttendancePage,
  EventDetailsPage,
  EventPage,
  FullCalendar,
  UserCheckinPage,
} from "./features/event";
import { SWToast } from "./features/pwa";
import { ScancodePage } from "./features/scancode";
import { ProfilePage } from "./features/user";
import Layout from "./layouts/Layout";
import AdminPage from "./pages/AdminPage";
import ErrorBoundary from "./screens/ErrorBoundary";
import Home from "./screens/Home";
import queryClient from "./services/queryClient";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <AuthWrapper />,
        children: [
          {
            path: "event/:eventId",
            element: <EventPage />,
            children: [
              {
                index: true,
                element: <EventDetailsPage />,
              },
              {
                path: "attendance",
                element: <AttendancePage />,
              },
              {
                path: "checkin",
                element: <UserCheckinPage />,
              },
              {
                element: <AuthWrapper adminOnly />,
                children: [
                  {
                    path: "admin-attendance",
                    element: <AdminAttendancePage />,
                  },
                ],
              },
            ],
          },
          {
            path: "agenda",
            element: <AgendaPage />,
          },
          {
            path: "calendar",
            element: <FullCalendar />,
          },
          {
            path: "codes",
            element: <ScancodePage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "outreach",
            lazy: () => import("@/features/outreach/pages/Leaderboard"),
          },
        ],
      },
      {
        element: <AuthWrapper adminOnly />,
        children: [
          {
            path: "event/create",
            lazy: () => import("./features/event/pages/CreateEventPage"),
          },
          {
            path: "event/:eventId/edit",
            lazy: () => import("./features/event/pages/EditEventPage"),
          },
          {
            path: "event/:eventId/admin-checkin",
            element: <AdminCheckinPage />,
          },
          {
            path: "admin",
            element: <AdminPage />,
          },
          {
            path: "profile/:userId",
            element: <ProfilePage />,
          },
          {
            path: "codes/:userId",
            element: <ScancodePage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChakraProvider>
    <ErrorBoundary>
      <SWToast />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ErrorBoundary>
  </ChakraProvider>
  // </React.StrictMode>
);
