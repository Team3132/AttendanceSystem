import { ChakraProvider } from "@chakra-ui/react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SWRConfig } from "swr";
import { CreateEventDrawer, ViewDetailsModal } from "./components";
import { AuthWrapper } from "./components/AuthWrapper";
import { EditDetailsModal } from "./components/EditDetailsDrawer";
import { ScanIn } from "./components/ScaninModal";
import { fetcher } from "./hooks";
import { CalendarScreen, Layout } from "./screens";
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<>Home</>} />
            <Route
              element={
                <AuthWrapper>
                  <CalendarScreen />
                </AuthWrapper>
              }
              path="calendar"
            >
              <Route path=":eventId/edit" element={<EditDetailsModal />} />
              <Route path=":eventId/view" element={<ViewDetailsModal />} />
              <Route path=":eventId/scanin" element={<ScanIn />} />
              <Route path="create" element={<CreateEventDrawer />} />
            </Route>
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
                <AuthWrapper>
                  <ProfileScreen />
                </AuthWrapper>
              }
              path="profile/:userId"
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </SWRConfig>
  </ChakraProvider>
  // </React.StrictMode>
);
