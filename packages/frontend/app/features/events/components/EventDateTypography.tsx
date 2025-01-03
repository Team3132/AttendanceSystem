import type { EventSchema } from "@/api/schema";
import { DateTime } from "luxon";
import type { z } from "zod";

interface EventDateTypographyProps {
  event: z.infer<typeof EventSchema>;
}

/**
 * A component that displays the date of an event
 * If the event is a one day event, it will display the date, start time and finish time.
 * Uf the event is a multi day event, it will display the start date time and end date time.
 * @param props The props for the EventDateTypography component
 */
export default function EventDateText(props: EventDateTypographyProps) {
  const { event } = props;
  const startDate = DateTime.fromMillis(Date.parse(event.startDate));
  const endDate = DateTime.fromMillis(Date.parse(event.endDate));

  if (startDate.hasSame(endDate, "day")) {
    return (
      <span>
        {startDate.toLocaleString(DateTime.DATE_FULL)}{" "}
        {startDate.toLocaleString(DateTime.TIME_SIMPLE)} -{" "}
        {endDate.toLocaleString(DateTime.TIME_SIMPLE)}
      </span>
    );
  }

  return (
    <span>
      {startDate.toLocaleString(DateTime.DATETIME_FULL)} -{" "}
      {endDate.toLocaleString(DateTime.DATETIME_FULL)}
    </span>
  );
}
