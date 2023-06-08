import loadable from "@loadable/component";

export const CreateEventPage = loadable(
  () => import("./pages/CreateEventPage")
);
export const AgendaPage = loadable(() => import("./pages/AgendaPage"));
export const EditEventPage = loadable(() => import("./pages/EditEventPage"));
export const Calendar = loadable(() => import("./pages/Calendar"));
export const FullCalendar = loadable(() => import("./pages/FullCalendar"));
export const EventPage = loadable(() => import("./pages/EventPage"));
export const AdminCheckinPage = loadable(
  () => import("./pages/AdminCheckinPage")
);
export const EventDetailsPage = loadable(
  () => import("./pages/EventDetailsPage")
);
export const UserCheckinPage = loadable(
  () => import("./pages/UserCheckinPage")
);
export const AttendancePage = loadable(() => import("./pages/AttendancePage"));
export const AdminAttendancePage = loadable(
  () => import("./pages/AdminAttendancePage")
);
