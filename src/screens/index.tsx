import loadable from "@loadable/component";

export const Home = loadable(() => import("./Home"));
export const Calendar = loadable(() => import("./Calendar"));
export const Agenda = loadable(() => import("./Agenda"));
export const Layout = loadable(() => import("./Layout"));
export const Profile = loadable(() => import("./Profile"));
export const EventEditScreen = loadable(() => import("./EventEditScreen"));
export const EventDetailsScreen = loadable(() => import("./EventDetails"));
export const ScancodeScreen = loadable(() => import("./ScanCodesScreen"));
export const ScaninScreen = loadable(() => import("./ScaninScreen"));
export const CreateEvent = loadable(() => import("./CreateEventScreen"));
