import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import type { RSVPUserSchema } from "@/api/schema";
import { DateTime } from "luxon";
import { FaCheck, FaClock, FaGear, FaQuestion, FaXmark } from "react-icons/fa6";
import type { z } from "zod";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { MdEdit } from "react-icons/md";
import { useCallback, useId, useRef } from "react";
import useAddUserRsvp from "../hooks/useAddRsvp";
import { useSuspenseQuery } from "@tanstack/react-query";
import { eventQueryOptions } from "@/queries/events.queries";
import { parseDate } from "@/utils/date";
import RSVPActionsButton from "./RSVPActionsButton";

interface AdminRSVPListItemProps {
  rsvp: z.infer<typeof RSVPUserSchema>;
}

export default function AdminRSVPListItem({ rsvp }: AdminRSVPListItemProps) {
  return (
    <>
      <ListItem
        secondaryAction={
          <RSVPActionsButton eventId={rsvp.eventId} userId={rsvp.userId} />
        }
      >
        <Tooltip title={rsvp.status ?? "No response"}>
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor:
                  rsvp.status === "YES" || rsvp.status === "ATTENDED"
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
              ) : rsvp.status === "YES" || rsvp.status === "ATTENDED" ? (
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
            rsvp.checkinTime && rsvp.checkoutTime && rsvp.status === "ATTENDED"
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
    </>
  );
}
