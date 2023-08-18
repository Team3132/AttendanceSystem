import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { RsvpUser } from "../../../api/generated";
import { FaCheck, FaClock, FaXmark, FaQuestion, FaGear } from "react-icons/fa6";
import { DateTime } from "luxon";
import RSVPEditDialog from "./RSVPEditDialog";
import { useDisclosure } from "../../../hooks/useDisclosure";

interface AdminRSVPListItemProps {
  rsvp: RsvpUser;
}

export default function AdminRSVPListItem({ rsvp }: AdminRSVPListItemProps) {
  const { getButtonProps, getDisclosureProps } = useDisclosure();

  return (
    <>
      <ListItem
        secondaryAction={
          <>
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
