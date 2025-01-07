import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import type { RSVPUserSchema } from "@/server/schema";
import { DateTime } from "luxon";
import { FaCheck, FaClock, FaGear, FaQuestion, FaXmark } from "react-icons/fa6";
import type { z } from "zod";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { MdEdit } from "react-icons/md";
import { useCallback, useId, useMemo, useRef } from "react";
import useAddUserRsvp from "../hooks/useAddRsvp";
import { useSuspenseQuery } from "@tanstack/react-query";
import { eventQueryOptions } from "@/queries/events.queries";
import { parseDate } from "@/utils/date";
import RSVPActionsButton from "./RSVPActionsButton";
import { check } from "drizzle-orm/pg-core";
import RSVPEventButton from "./RSVPEventButton";

interface AdminRSVPListItemProps {
  rsvp: z.infer<typeof RSVPUserSchema>;
}

export default function AdminRSVPListItem({ rsvp }: AdminRSVPListItemProps) {
  const { isSameDay, checkout, checkin } = useMemo(() => {
    const checkinIso = parseDate(rsvp.checkinTime);
    const checkoutIso = parseDate(rsvp.checkoutTime);

    const checkin = checkinIso ? DateTime.fromISO(checkinIso) : null;
    const checkout = checkoutIso ? DateTime.fromISO(checkoutIso) : null;
    const isSameDay =
      checkin && checkout ? checkin.hasSame(checkout, "day") : false;

    return {
      checkin,
      checkout,
      isSameDay,
    };
  }, [rsvp.checkinTime, rsvp.checkoutTime]);

  const message = useMemo(() => {
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
  }, [isSameDay, checkin, checkout]);

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
      <ListItemText primary={rsvp.user.username} secondary={message} />
    </ListItem>
  );
}
