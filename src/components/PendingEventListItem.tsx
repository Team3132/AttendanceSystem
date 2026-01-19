import type { RSVPEventSchema } from "@/server/schema/RSVPEventSchema";
import { getLocale } from "@/utils/dt";
import { Button, ListItem, ListItemText } from "@mui/material";
import { DateTime } from "luxon";
import type { z } from "zod";
import useSelfCheckout from "../hooks/useSelfCheckout";

interface PendingEventListItemProps {
  rsvp: z.infer<typeof RSVPEventSchema>;
}

export default function PendingEventListItem(props: PendingEventListItemProps) {
  const { rsvp } = props;

  const selfCheckoutMutation = useSelfCheckout();

  const handleClick = () => {
    selfCheckoutMutation.mutate({ data: rsvp.eventId });
  };

  return (
    <ListItem>
      <ListItemText
        primary={rsvp.event.title}
        secondary={`Checked In: ${
          rsvp.checkinTime
            ? DateTime.fromJSDate(rsvp.checkinTime).toLocaleString(
                DateTime.DATETIME_MED,
                {
                  locale: getLocale(),
                },
              )
            : "Unknown"
        }`}
      />
      <Button
        variant="contained"
        color="primary"
        loading={selfCheckoutMutation.isPending}
        onClick={handleClick}
      >
        Checkout
      </Button>
    </ListItem>
  );
}
