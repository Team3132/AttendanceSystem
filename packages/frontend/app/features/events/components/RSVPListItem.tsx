import { ListItem, ListItemAvatar, ListItemText, Tooltip } from "@mui/material";
import type { RSVPUserSchema } from "@/server/schema";
import { DateTime } from "luxon";
import type { z } from "zod";
import StatusAvatar from "./StatusAvatar";

interface RSVPListItemProps {
  rsvp: z.infer<typeof RSVPUserSchema>;
}

export default function RSVPListItem({ rsvp }: RSVPListItemProps) {
  return (
    <ListItem>
      <Tooltip title={rsvp.status ?? "No response"}>
        <ListItemAvatar>
          <StatusAvatar status={rsvp.status} />
        </ListItemAvatar>
      </Tooltip>
      <ListItemText
        primary={rsvp.user.username}
        secondary={
          rsvp.checkinTime && rsvp.checkoutTime
            ? `Checked out at ${DateTime.fromMillis(
                Date.parse(rsvp.checkoutTime),
              ).toLocaleString(DateTime.TIME_SIMPLE)}`
            : rsvp.checkinTime
              ? `Checked in at ${DateTime.fromMillis(
                  Date.parse(rsvp.checkinTime),
                ).toLocaleString(DateTime.TIME_SIMPLE)}`
              : "No check-in"
        }
      />
    </ListItem>
  );
}
