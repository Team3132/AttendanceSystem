import loadable from "@loadable/component";
import { Provider as AlertProvider } from "react-alert";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthWrapper, ChakraAlert } from "./components";
import { fetcher } from "./hooks";
import {
  Agenda,
  Calendar,
  CreateEvent,
  EventDetailsScreen,
  EventEditScreen,
  Home,
  Layout,
  Profile,
  ScancodeScreen,
  ScaninScreen,
} from "./screens";
const ChakraProvider = loadable(() => import("@chakra-ui/react"), {
  resolveComponent: (components) => components.ChakraProvider,
});
const SWRConfig = loadable(() => import("swr"), {
  resolveComponent: (components) => components.SWRConfig,
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ChakraProvider>
    <SWRConfig
      value={{
        fetcher,
        onError: (error) => {
          console.log("This is an error", error);
        },
      }}
    >
      <AlertProvider template={ChakraAlert}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="event/create" element={<CreateEvent />} />
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
                element={
                  <AuthWrapper>
                    <Calendar />
                  </AuthWrapper>
                }
                path="calendar"
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
      </AlertProvider>
    </SWRConfig>
  </ChakraProvider>
  // </React.StrictMode>
);
