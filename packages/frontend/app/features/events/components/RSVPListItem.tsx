import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import type { RSVPUserSchema } from "@/server/schema";
import { DateTime } from "luxon";
import { FaCheck, FaClock, FaQuestion, FaXmark } from "react-icons/fa6";
import type { z } from "zod";

interface RSVPListItemProps {
  rsvp: z.infer<typeof RSVPUserSchema>;
}

export default function RSVPListItem({ rsvp }: RSVPListItemProps) {
  return (
    <ListItem>
      <Tooltip title={rsvp.status ?? "No response"}>
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor:
                rsvp.status === "YES"
                  ? "success.main"
                  : rsvp.status === "NO"
                    ? "error.main"
                    : rsvp.status === "LATE"
                      ? "warning.main"
                      : undefined,
            }}
          >
            {rsvp.status === null ? (
              ""
            ) : rsvp.status === "YES" ? (
              <FaCheck />
            ) : rsvp.status === "NO" ? (
              <FaXmark />
            ) : rsvp.status === "LATE" ? (
              <FaClock />
            ) : (
              <FaQuestion />
            )}
          </Avatar>
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
