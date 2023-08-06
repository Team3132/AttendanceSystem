import { ListItem, ListItemText } from "@mui/material";
import { RsvpEvent } from "../api/generated";
import { LoadingButton } from "@mui/lab";
import useCheckout from "../hooks/useCheckout";

interface PendingEventListItemProps {
  rsvp: RsvpEvent;
}

export default function PendingEventListItem(props: PendingEventListItemProps) {
  const { rsvp } = props;

  const checkoutMutation = useCheckout();

  const handleClick = () => {
    checkoutMutation.mutate(rsvp.eventId);
  };

  return (
    <ListItem>
      <ListItemText primary={rsvp.event.title} />
      <LoadingButton
        variant="contained"
        color="primary"
        loading={checkoutMutation.isPending}
        onClick={handleClick}
      >
        Checkout
      </LoadingButton>
    </ListItem>
  );
}
