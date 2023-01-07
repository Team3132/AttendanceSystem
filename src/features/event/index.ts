import loadable from "@loadable/component";

export const CreateEventPage = loadable(
  () => import("./pages/CreateEventPage")
);
export const AgendaPage = loadable(() => import("./pages/AgendaPage"));
export const EditEventPage = loadable(() => import("./pages/EditEventPage"));
export const Calendar = loadable(() => import("./pages/Calendar"));
export const FullCalendar = loadable(() => import("./pages/FullCalendar"));
export const EventPage = loadable(() => import("./pages/EventPage"));
