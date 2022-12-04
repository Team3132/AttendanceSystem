import loadable from "@loadable/component";

const Skeleton = loadable(() => import("./Skeleton"));
export const Home = loadable(() => import("./Home"), {
  fallback: <Skeleton />,
});
export const Calendar = loadable(() => import("./Calendar"), {
  fallback: <Skeleton />,
});
export const Agenda = loadable(() => import("./Agenda"), {
  fallback: <Skeleton />,
});
export const Layout = loadable(() => import("./Layout"));
export const Profile = loadable(() => import("./Profile"), {
  fallback: <Skeleton />,
});
export const EventEditScreen = loadable(() => import("./EventEditScreen"), {
  fallback: <Skeleton />,
});
export const EventDetailsScreen = loadable(() => import("./EventDetails"), {
  fallback: <Skeleton />,
});
export const ScancodeScreen = loadable(() => import("./ScanCodesScreen"), {
  fallback: <Skeleton />,
});
export const ScaninScreen = loadable(() => import("./ScaninScreen"), {
  fallback: <Skeleton />,
});
export const CreateEvent = loadable(() => import("./CreateEventScreen"), {
  fallback: <Skeleton />,
});
export const ErrorBoundary = loadable(() => import("./ErrorBoundary"));
export const AdminScreen = loadable(() => import("./Admin"), {
  fallback: <Skeleton />,
});
// export const CustomCalendar = loadable(() => import("./CustomCalendar"));
