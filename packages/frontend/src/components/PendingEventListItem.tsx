import { LoadingButton } from "@mui/lab";
import { ListItem, ListItemText } from "@mui/material";
import { RSVPEventSchema } from "backend/schema";
import { DateTime } from "luxon";
import { z } from "zod";
import useSelfCheckout from "../hooks/useSelfCheckout";

interface PendingEventListItemProps {
  rsvp: z.infer<typeof RSVPEventSchema>;
}

export default function PendingEventListItem(props: PendingEventListItemProps) {
  const { rsvp } = props;

  const selfCheckoutMutation = useSelfCheckout();

  const handleClick = () => {
    selfCheckoutMutation.mutate(rsvp.id);
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
        loading={selfCheckoutMutation.isPending}
        onClick={handleClick}
      >
        Checkout
      </LoadingButton>
    </ListItem>
  );
}