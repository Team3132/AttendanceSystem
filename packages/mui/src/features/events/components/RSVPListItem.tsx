import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { RsvpUser } from "../../../api/generated";
import { FaCheck, FaClock, FaXmark, FaQuestion } from "react-icons/fa6";
import RoleChip from "../../../components/RoleText";

interface RSVPListItemProps {
  rsvp: RsvpUser;
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
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
            }}
          >
            {rsvp.user.roles.map((roleId) => (
              <RoleChip roleId={roleId} key={roleId} />
            ))}
          </Box>
        }
      />
    </ListItem>
  );
}
