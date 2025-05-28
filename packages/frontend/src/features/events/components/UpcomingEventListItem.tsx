import { ListItemText, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useMemo } from "react";
import EventDateText from "./EventDateTypography";

interface UpcomingEventListItemProps {
  event: {
    startDate: Date;
    endDate: Date;
    title: string;
  };
}

export default function UpcomingEventListItem(
  props: UpcomingEventListItemProps,
) {
  const { event } = props;

  const isCurrentlyHappening = useMemo(
    () =>
      DateTime.now() > DateTime.fromJSDate(event.startDate) &&
      DateTime.now() < DateTime.fromJSDate(event.endDate),
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
        {DateTime.fromJSDate(event.startDate).toRelativeCalendar()}
      </Typography>
    </>
  );
}
