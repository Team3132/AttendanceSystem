import { ListItemButton, ListItemText, Typography } from "@mui/material";
import EventDateText from "./EventDateTypography";
import { DateTime } from "luxon";
import LinkBehavior from "../../../utils/LinkBehavior";
import { z } from "zod";
import { EventSchema } from "@team3132/attendance-backend/schema";

interface UpcomingEventListItemProps {
  event: z.infer<typeof EventSchema>;
}

export default function UpcomingEventListItem(
  props: UpcomingEventListItemProps
) {
  const { event } = props;
  return (
    <ListItemButton LinkComponent={LinkBehavior} href={`/events/${event.id}`}>
      <ListItemText
        primary={event.title}
        secondary={
          <Typography variant="body2">
            <EventDateText event={event} />
          </Typography>
        }
      />
      <Typography variant="body2">
        {DateTime.fromISO(event.startDate).toRelativeCalendar()}
      </Typography>
    </ListItemButton>
  );
}
