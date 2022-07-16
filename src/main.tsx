import { AuthWrapper, ChakraAlert } from "@components";
import loadable from "@loadable/component";
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
} from "@screens";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const ChakraProvider = loadable(() => import("@chakra-ui/react"), {
  resolveComponent: (components) => components.ChakraProvider,
});
const SWRConfigWithFetcher = loadable(
  () => import("./components/SWRProviderWithFetcher")
);
const AlertProvider = loadable(() => import("react-alert"), {
  resolveComponent: (comps) => comps.Provider,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ChakraProvider>
    <SWRConfigWithFetcher>
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
    </SWRConfigWithFetcher>
  </ChakraProvider>
  // </React.StrictMode>
);
