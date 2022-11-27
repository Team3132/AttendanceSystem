import { AuthWrapper, ChakraProvider, SWToast } from "@components";
import {
  AdminScreen,
  Agenda,
  Calendar,
  CreateEvent,
  CustomCalendar,
  ErrorBoundary,
  EventDetailsScreen,
  EventEditScreen,
  Home,
  Layout,
  Profile,
  ScancodeScreen,
  ScaninScreen,
} from "@screens";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ChakraProvider>
    <ErrorBoundary>
      <SWToast />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Pages */}
              <Route index element={<Home />} />
              {/* Authenticated-only pages */}
              <Route element={<AuthWrapper />}>
                <Route path="event/:eventId">
                  <Route path="view" element={<EventDetailsScreen />} />
                  <Route path="scanin" element={<ScaninScreen />} />
                </Route>
                <Route path="calendar/agenda" element={<Agenda />} />
                <Route path="calendar/custom" element={<CustomCalendar />} />
                <Route element={<Calendar />} path="calendar" />
                <Route element={<ScancodeScreen />} path="codes" />
                <Route element={<Profile />} path="profile" />
              </Route>
              {/* Admin only pages */}
              <Route element={<AuthWrapper adminOnly />}>
                <Route path="event/create" element={<CreateEvent />} />
                <Route
                  path="event/:eventId/edit"
                  element={<EventEditScreen />}
                />
                <Route element={<AdminScreen />} path="admin" />
                <Route element={<Profile />} path="profile/:userId" />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ErrorBoundary>
  </ChakraProvider>
  // </React.StrictMode>
);
