import { eventQueryOptions } from "@/queries/events.queries";
import { IconButton } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { MdCheck } from "react-icons/md";
import useAddUserRsvp from "../hooks/useAddRsvp";

interface RSVPEventButtonProps {
  eventId: string;
  userId: string;
}

export default function RSVPEventButton(props: RSVPEventButtonProps) {
  const { eventId, userId } = props;
  const queryClient = useQueryClient();

  const addUserEventRsvpMutation = useAddUserRsvp();

  /**
   * Set the user's empty check-in and checkout times to the event's start and/or end time.
   */
  const rsvpEventTime = useCallback(async () => {
    const eventDetails = await queryClient.ensureQueryData(
      eventQueryOptions.eventDetails(eventId),
    );

    await addUserEventRsvpMutation.mutateAsync({
      data: {
        eventId: eventId,
        userId: userId,
        checkinTime: eventDetails.startDate,
        checkoutTime: eventDetails.endDate,
      },
    });
  }, [addUserEventRsvpMutation, queryClient, eventId, userId]);

  return (
    <IconButton
      disabled={addUserEventRsvpMutation.isPending}
      onClick={rsvpEventTime}
    >
      <MdCheck />
    </IconButton>
  );
}
