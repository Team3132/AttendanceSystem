import { ChakraProvider } from "@chakra-ui/react";
import { Provider as AlertProvider } from "react-alert";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SWRConfig } from "swr";
import {
  ChakraAlert,
  CreateEventDrawer,
  ScancodeList,
  ViewDetailsModal,
} from "./components";
import { AuthWrapper } from "./components/AuthWrapper";
import { EditDetailsModal } from "./components/EditDetailsDrawer";
import { ScanIn } from "./components/ScaninModal";
import { fetcher } from "./hooks";
import { CalendarScreen, Layout } from "./screens";
import { Home } from "./screens/Home";
import { ProfileScreen } from "./screens/Profile";
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
              <Route
                element={
                  <AuthWrapper>
                    <CalendarScreen />
                  </AuthWrapper>
                }
                path="calendar"
              >
                <Route
                  path=":eventId/edit"
                  element={
                    <AuthWrapper adminOnly>
                      <EditDetailsModal />
                    </AuthWrapper>
                  }
                />
                <Route path=":eventId/view" element={<ViewDetailsModal />} />
                <Route path=":eventId/scanin" element={<ScanIn />} />
                <Route path="create" element={<CreateEventDrawer />} />
              </Route>
              <Route
                element={
                  <AuthWrapper>
                    <ScancodeList />
                  </AuthWrapper>
                }
                path="codes"
              />
              <Route
                element={
                  <AuthWrapper>
                    <ProfileScreen />
                  </AuthWrapper>
                }
                path="profile"
              />
              <Route
                element={
                  <AuthWrapper adminOnly>
                    <ProfileScreen />
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
