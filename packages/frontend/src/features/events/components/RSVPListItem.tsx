import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { FaCheck, FaClock, FaXmark, FaQuestion } from "react-icons/fa6";
import { DateTime } from "luxon";
import { z } from "zod";
import { RSVPUserSchema } from "newbackend/schema";

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
            ? `Checked out at ${DateTime.fromISO(
                rsvp.checkoutTime
              ).toLocaleString(DateTime.TIME_SIMPLE)}`
            : rsvp.checkinTime
              ? `Checked in at ${DateTime.fromISO(
                  rsvp.checkinTime
                ).toLocaleString(DateTime.TIME_SIMPLE)}`
              : "No check-in"
        }
      />
    </ListItem>
  );
}
