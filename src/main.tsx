import { ChakraProvider } from "@chakra-ui/react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SWRConfig } from "swr";
import { CreateEventDrawer, ViewDetailsModal } from "./components";
import { EditDetailsModal } from "./components/EditDetailsDrawer";
import { fetcher } from "./hooks";
import { CalendarScreen, Layout } from "./screens";
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
            <Route index element={<Navigate to="/calendar" />} />
            <Route element={<CalendarScreen />} path="calendar">
              <Route path="edit/:eventId" element={<EditDetailsModal />} />
              <Route path="view/:eventId" element={<ViewDetailsModal />} />
              <Route path="create" element={<CreateEventDrawer />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </SWRConfig>
  </ChakraProvider>
  // </React.StrictMode>
);
