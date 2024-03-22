import { LoadingButton } from "@mui/lab";
import { ListItem, ListItemText } from "@mui/material";
import { RSVPEventSchema } from "backend/schema";
import { DateTime } from "luxon";
import { z } from "zod";
import useUserCheckout from "../hooks/useUserCheckout";

interface PendingEventListItemProps {
  rsvp: z.infer<typeof RSVPEventSchema>;
  userId: string;
}

export default function PendingEventListItem(props: PendingEventListItemProps) {
  const { rsvp, userId } = props;

  const userCheckoutMutation = useUserCheckout();

  const handleClick = () => {
    userCheckoutMutation.mutate({ eventId: rsvp.event.id, userId });
  };

  return (
    <ListItem>
      <ListItemText
        primary={rsvp.event.title}
        secondary={`Checked In: ${
          rsvp.checkinTime
            ? DateTime.fromISO(rsvp.checkinTime).toLocaleString(
                DateTime.DATETIME_MED,
              )
            : "Unknown"
        }`}
      />
      <LoadingButton
        variant="contained"
        color="primary"
        loading={userCheckoutMutation.isPending}
        onClick={handleClick}
      >
        Checkout
      </LoadingButton>
    </ListItem>
  );
}