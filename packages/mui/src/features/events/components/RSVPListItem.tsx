import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { RsvpUser } from "../../../api/generated";
import { FaCheck, FaClock, FaXmark, FaQuestion } from "react-icons/fa6";

interface RSVPListItemProps {
  rsvp: RsvpUser;
}

export default function RSVPListItem({ rsvp }: RSVPListItemProps) {
  return (
    <ListItem>
      <Tooltip title={rsvp.status ?? "No response"}>
        <ListItemAvatar>
          <Avatar>
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
      <ListItemText primary={rsvp.user.username} />
    </ListItem>
  );
}
