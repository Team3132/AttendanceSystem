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
              <Route index element={<Home />} />
              <Route
                path="event/create"
                element={
                  <AuthWrapper adminOnly>
                    <CreateEvent />
                  </AuthWrapper>
                }
              />
              <Route path="event/:eventId">
                <Route
                  path="edit"
                  element={
                    <AuthWrapper adminOnly>
                      <EventEditScreen />
                    </AuthWrapper>
                  }
                />
                <Route path="view" element={<EventDetailsScreen />} />
                <Route path="scanin" element={<ScaninScreen />} />
              </Route>
              <Route
                path="calendar/agenda"
                element={
                  <AuthWrapper>
                    <Agenda />
                  </AuthWrapper>
                }
              />
              <Route
                path="calendar/custom"
                element={
                  <AuthWrapper>
                    <CustomCalendar />
                  </AuthWrapper>
                }
              />
              <Route
                element={
                  <AuthWrapper>
                    <Calendar />
                  </AuthWrapper>
                }
                path="calendar"
              />
              <Route
                element={
                  <AuthWrapper adminOnly>
                    <AdminScreen />
                  </AuthWrapper>
                }
                path="admin"
              />
              <Route
                element={
                  <AuthWrapper>
                    <ScancodeScreen />
                  </AuthWrapper>
                }
                path="codes"
              />
              <Route
                element={
                  <AuthWrapper>
                    <Profile />
                  </AuthWrapper>
                }
                path="profile"
              />
              <Route
                element={
                  <AuthWrapper adminOnly>
                    <Profile />
                  </AuthWrapper>
                }
                path="profile/:userId"
              />
            </Route>
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ErrorBoundary>
  </ChakraProvider>
  // </React.StrictMode>
);
