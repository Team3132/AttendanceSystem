import { eventQueryOptions } from "@/queries/events.queries";
import { parseDate } from "@/utils/date";
import { IconButton } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { MdCheck } from "react-icons/md";
import useAddUserRsvp from "../hooks/useAddRsvp";

interface RSVPEventButtonProps {
  eventId: string;
  userId: string;
}

export default function RSVPEventButton(props: RSVPEventButtonProps) {
  const { eventId, userId } = props;

  const eventDetailsQuery = useSuspenseQuery(
    eventQueryOptions.eventDetails(eventId),
  );

  const addUserEventRsvpMutation = useAddUserRsvp();

  /**
   * Set the user's empty check-in and checkout times to the event's start and/or end time.
   */
  const rsvpEventTime = useCallback(async () => {
    await addUserEventRsvpMutation.mutateAsync({
      data: {
        eventId: eventId,
        userId: userId,
        checkinTime: parseDate(eventDetailsQuery.data.startDate),
        checkoutTime: parseDate(eventDetailsQuery.data.endDate),
      },
    });
  }, [
    addUserEventRsvpMutation,
    eventDetailsQuery.data.endDate,
    eventDetailsQuery.data.startDate,
    eventId,
    userId,
  ]);

  return (
    <IconButton
      disabled={addUserEventRsvpMutation.isPending}
      onClick={rsvpEventTime}
    >
      <MdCheck />
    </IconButton>
  );
}
