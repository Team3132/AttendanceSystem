import { ListItemText, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useMemo } from "react";
import EventDateText from "./EventDateTypography";

interface UpcomingEventListItemProps {
  event: {
    startDate: string;
    endDate: string;
    title: string;
  };
}

export default function UpcomingEventListItem(
  props: UpcomingEventListItemProps,
) {
  const { event } = props;

  const isCurrentlyHappening = useMemo(
    () =>
      DateTime.now() > DateTime.fromISO(event.startDate) &&
      DateTime.now() < DateTime.fromISO(event.endDate),
    [event.startDate, event.endDate],
  );

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
      <Typography
        variant="body2"
        color={isCurrentlyHappening ? "success" : undefined}
      >
        {DateTime.fromMillis(Date.parse(event.startDate)).toRelativeCalendar()}
      </Typography>
    </>
  );
}
