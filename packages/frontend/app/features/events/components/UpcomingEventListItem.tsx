import { ListItemText, Typography } from "@mui/material";
import type { EventSchema } from "@/api/schema";
import { DateTime } from "luxon";
import type { z } from "zod";
import EventDateText from "./EventDateTypography";

interface UpcomingEventListItemProps {
  event: z.infer<typeof EventSchema>;
}

export default function UpcomingEventListItem(
  props: UpcomingEventListItemProps,
) {
  const { event } = props;
  return (
    <>
      <ListItemText
        primary={event.title}
        secondary={
          <Typography variant="body2">
            <EventDateText event={event} />
          </Typography>
        }
      />
      <Typography variant="body2">
        {DateTime.fromMillis(Date.parse(event.startDate)).toRelativeCalendar()}
      </Typography>
    </>
  );
}
