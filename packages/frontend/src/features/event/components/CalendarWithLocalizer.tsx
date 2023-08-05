import { DateTime } from "luxon";
import {
  Calendar,
  CalendarProps,
  Event,
  luxonLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

export const CalendarWithLocalizer = (
  props: JSX.IntrinsicAttributes &
    JSX.IntrinsicClassAttributes<Calendar<Event, object>> &
    Readonly<Omit<CalendarProps<Event, object>, "localizer">>,
) => {
  const localizer = luxonLocalizer(DateTime);

  return <Calendar {...props} localizer={localizer} />;
};
export default CalendarWithLocalizer;
