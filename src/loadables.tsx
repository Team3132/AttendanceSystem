import loadable from "@loadable/component";

export const Home = loadable(() => import("./screens/Home"));
export const Calendar = loadable(() => import("./screens/Calendar"));
export const Agenda = loadable(() => import("./screens/Agenda"));
export const Layout = loadable(() => import("./screens/Layout"));
export const Profile = loadable(() => import("./screens/Profile"));
export const EventEditScreen = loadable(
  () => import("./screens/EventEditScreen")
);
export const EventDetailsScreen = loadable(
  () => import("./screens/EventDetails")
);
export const ScancodeScreen = loadable(
  () => import("./screens/ScanCodesScreen")
);
export const ScaninScreen = loadable(() => import("./screens/ScaninScreen"));
