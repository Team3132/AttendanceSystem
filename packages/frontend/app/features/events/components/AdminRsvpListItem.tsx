import type { RSVPUserSchema } from "@/server/schema";
import { parseDate } from "@/utils/date";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
} from "@mui/material";
import { DateTime } from "luxon";
import { useMemo } from "react";
import type { z } from "zod";
import RSVPActionsButton from "./RSVPActionsButton";
import RSVPEventButton from "./RSVPEventButton";
import StatusAvatar from "./StatusAvatar";

interface AdminRSVPListItemProps {
  rsvp: z.infer<typeof RSVPUserSchema>;
}

const generateCheckinCheckout = (
  checkinTime: string | null,
  checkoutTime: string | null,
) => {
  const checkinIso = parseDate(checkinTime);
  const checkoutIso = parseDate(checkoutTime);

  const checkin = checkinIso ? DateTime.fromISO(checkinIso) : null;
  const checkout = checkoutIso ? DateTime.fromISO(checkoutIso) : null;
  const isSameDay =
    checkin && checkout ? checkin.hasSame(checkout, "day") : false;

  if (isSameDay && checkin && checkout) {
    const hours = checkout.diff(checkin, "hours").hours;
    // If the checkin and checkout are on the same day, show the time range
    return `${checkin.toLocaleString(
      DateTime.TIME_SIMPLE,
    )} - ${checkout.toLocaleString(DateTime.TIME_SIMPLE)} (${hours} hours)`;
  }

  if (checkin && checkout) {
    const hours = checkout.diff(checkin, "hours").hours;
    // If the checkin and checkout are not on the same day, show the date range
    return `${checkin.toLocaleString(
      DateTime.DATETIME_MED,
    )} - ${checkout.toLocaleString(DateTime.DATETIME_MED)} (${hours} hours)`;
  }

  if (checkin) {
    // If there is a checkin time, show the checkin time
    return `Checked in at ${checkin.toLocaleString(DateTime.TIME_SIMPLE)}`;
  }

  // If there is no checkin time, show that there is no checkin
  return "No check-in";
};

export default function AdminRSVPListItem({ rsvp }: AdminRSVPListItemProps) {
  const message = useMemo(
    () => generateCheckinCheckout(rsvp.checkinTime, rsvp.checkoutTime),
    [rsvp.checkinTime, rsvp.checkoutTime],
  );

  return (
    <ListItem
      secondaryAction={
        <Stack direction={"row"} spacing={1}>
          <RSVPEventButton eventId={rsvp.eventId} userId={rsvp.userId} />
          <RSVPActionsButton eventId={rsvp.eventId} userId={rsvp.userId} />
        </Stack>
      }
    >
      <Tooltip title={rsvp.status ?? "No response"}>
        <ListItemAvatar>
          <StatusAvatar status={rsvp.status} />
        </ListItemAvatar>
      </Tooltip>
      <ListItemText primary={rsvp.user.username} secondary={message} />
    </ListItem>
  );
}
