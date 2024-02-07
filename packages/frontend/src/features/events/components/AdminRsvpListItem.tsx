import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { RSVPUserSchema } from "backend/schema";
import { DateTime } from "luxon";
import { useAlert } from "react-alert";
import { FaCheck, FaClock, FaGear, FaQuestion, FaXmark } from "react-icons/fa6";
import { z } from "zod";
import { useDisclosure } from "../../../hooks/useDisclosure";
import useCheckinUser from "../hooks/useCheckinUser";
import useCheckoutUser from "../hooks/useCheckoutUser";
import RSVPEditDialog from "./RSVPEditDialog";

interface AdminRSVPListItemProps {
  rsvp: z.infer<typeof RSVPUserSchema>;
}

export default function AdminRSVPListItem({ rsvp }: AdminRSVPListItemProps) {
  const { getButtonProps, getDisclosureProps } = useDisclosure();
  const checkoutMutation = useCheckoutUser();
  const checkinMutation = useCheckinUser();
  const alert = useAlert();

  const handleCheckIn = () =>
    checkinMutation.mutate({
      eventId: rsvp.eventId,
      userId: rsvp.userId,
    });

  const handleCheckOut = () =>
    checkoutMutation.mutate({
      eventId: rsvp.eventId,
      userId: rsvp.userId,
    });

  const handleCheckInOut = () => {
    if (!rsvp.checkinTime) {
      handleCheckIn();
    } else if (!rsvp.checkoutTime) {
      handleCheckOut();
    } else {
      alert.error("User already checked out");
    }
  };

  return (
    <>
      <ListItem
        secondaryAction={
          <>
            <Tooltip title="Check in/out">
              <IconButton
                onClick={handleCheckInOut}
                disabled={
                  checkinMutation.isPending || checkoutMutation.isPending
                }
              >
                <FaClock />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton {...getButtonProps()}>
                <FaGear />
              </IconButton>
            </Tooltip>
          </>
        }
      >
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
                  rsvp.checkoutTime,
                ).toLocaleString(DateTime.TIME_SIMPLE)}`
              : rsvp.checkinTime
                ? `Checked in at ${DateTime.fromISO(
                    rsvp.checkinTime,
                  ).toLocaleString(DateTime.TIME_SIMPLE)}`
                : "No check-in"
          }
        />
      </ListItem>
      <RSVPEditDialog rsvp={rsvp} {...getDisclosureProps()} />
    </>
  );
}
