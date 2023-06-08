import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthWrapper } from "./features/auth";
import {
  AdminAttendancePage,
  AdminCheckinPage,
  AgendaPage,
  AttendancePage,
  CreateEventPage,
  EditEventPage,
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ChakraProvider>
      <ErrorBoundary>
        <SWToast />
        <QueryClientProvider
          client={queryClient}
          // persistOptions={{ persister }}
          // onSuccess={() => {
          //   // resume mutations after initial restore from localStorage was successful
          //   queryClient.resumePausedMutations().then(() => {
          //     queryClient.invalidateQueries();
          //   });
          // }}
        >
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Pages */}
              <Route index element={<Home />} />
              {/* Authenticated-only pages */}
              <Route element={<AuthWrapper />}>
                <Route path="event/:eventId" element={<EventPage />}>
                  <Route index element={<EventDetailsPage />} />
                  <Route path="attendance" element={<AttendancePage />} />
                  <Route path="checkin" element={<UserCheckinPage />} />
                </Route>
                <Route path="agenda" element={<AgendaPage />} />
                <Route path="calendar" element={<FullCalendar />} />
                <Route element={<ScancodePage />} path="codes" />
                <Route element={<ProfilePage />} path="profile" />
              </Route>
              {/* Admin only pages */}
              <Route element={<AuthWrapper adminOnly />}>
                <Route path="event/create" element={<CreateEventPage />} />
                <Route path="event/:eventId/edit" element={<EditEventPage />} />
                <Route
                  path="event/:eventId/admin-attendance"
                  element={<AdminAttendancePage />}
                />
                <Route element={<AdminPage />} path="admin" />
                <Route element={<ProfilePage />} path="profile/:userId" />
                <Route element={<ScancodePage />} path="codes/:userId" />
              </Route>
            </Route>
            <Route element={<AuthWrapper adminOnly />}>
              <Route
                path="/event/:eventId/admin-checkin"
                element={<AdminCheckinPage />}
              />
            </Route>
          </Routes>

          <ReactQueryDevtools />
        </QueryClientProvider>
      </ErrorBoundary>
    </ChakraProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
