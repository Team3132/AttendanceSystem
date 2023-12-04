import { ListItem, ListItemText } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useSelfCheckout from "../hooks/useSelfCheckout";
import useUserCheckout from "../hooks/useUserCheckout";
import { DateTime } from "luxon";
import { z } from "zod";
import { RSVPEventSchema } from "newbackend/schema";

interface PendingEventListItemProps {
  rsvp: z.infer<typeof RSVPEventSchema>;
  userId?: string;
}

export default function PendingEventListItem(props: PendingEventListItemProps) {
  const { rsvp, userId = "me" } = props;

  const selfCheckoutMutation = useSelfCheckout();
  const userCheckoutMutation = useUserCheckout();

  const handleClick = () => {
    if (userId === "me") {
      selfCheckoutMutation.mutate(rsvp.id);
    } else {
      userCheckoutMutation.mutate({ eventId: rsvp.event.id, userId });
    }
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
        loading={
          selfCheckoutMutation.isLoading || userCheckoutMutation.isLoading
        }
        onClick={handleClick}
      >
        Checkout
      </LoadingButton>
    </ListItem>
  );
}
