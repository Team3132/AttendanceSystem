import { ListItem, ListItemText } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useSelfCheckout from "../hooks/useSelfCheckout";
import { DateTime } from "luxon";
import { z } from "zod";
import { RSVPEventSchema } from "@team3132/attendance-backend/schema";

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
                DateTime.DATETIME_MED
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
