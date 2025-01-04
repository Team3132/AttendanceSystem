import { useDisclosure } from "@/hooks/useDisclosure";
import { eventQueryOptions } from "@/queries/events.queries";
import { parseDate } from "@/utils/date";
import { IconButton, Menu, MenuItem, Divider } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useId, useRef, useCallback } from "react";
import { MdEdit } from "react-icons/md";
import useAddUserRsvp from "../hooks/useAddRsvp";

interface RSVPActionsButtonProps {
  eventId: string;
  userId: string;
}

export default function RSVPActionsButton(props: RSVPActionsButtonProps) {
  const { eventId, userId } = props;

  const { getButtonProps, getDisclosureProps, isOpen, onClose } =
    useDisclosure();

  const eventDetailsQuery = useSuspenseQuery(
    eventQueryOptions.eventDetails(eventId),
  );
  const rsvpDetailsQuery = useSuspenseQuery(
    eventQueryOptions.userRsvp(eventId, userId),
  );

  const addUserEventRsvpMutation = useAddUserRsvp();

  const menuId = useId();
  const anchorEl = useRef(null);

  /**
   * Set the user's check-in time to the current time.
   */
  const checkinUserNow = useCallback(async () => {
    await addUserEventRsvpMutation.mutateAsync({
      data: {
        eventId: eventId,
        userId: userId,
        checkinTime: DateTime.now().toISO(),
      },
    });

    // Close the menu
    onClose();
  }, [addUserEventRsvpMutation, eventId, userId, onClose]);

  /**
   * Set the user's checkout time to the current time.
   */
  const checkoutUserNow = useCallback(async () => {
    const checkinTime = rsvpDetailsQuery.data?.checkinTime
      ? parseDate(rsvpDetailsQuery.data.checkinTime)
      : eventDetailsQuery.data.startDate;

    await addUserEventRsvpMutation.mutateAsync({
      data: {
        eventId: eventId,
        userId: userId,
        checkinTime: checkinTime,
        checkoutTime: DateTime.now().toISO(),
      },
    });

    // Close the menu
    onClose();
  }, [
    addUserEventRsvpMutation,
    eventId,
    userId,
    onClose,
    rsvpDetailsQuery.data?.checkinTime,
    eventDetailsQuery.data.startDate,
  ]);

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

    // Close the menu
    onClose();
  }, [
    addUserEventRsvpMutation,
    eventDetailsQuery.data.endDate,
    eventDetailsQuery.data.startDate,
    eventId,
    userId,
    onClose,
  ]);

  /**
   * Clear the user's check-in and checkout times.
   * (Assume "RSVP'd" status)
   */
  const clearCheckinCheckout = useCallback(async () => {
    await addUserEventRsvpMutation.mutateAsync({
      data: {
        eventId: eventId,
        userId: userId,
        checkinTime: null,
        checkoutTime: null,
        status: "YES",
      },
    });

    // Close the menu
    onClose();
  }, [addUserEventRsvpMutation, eventId, userId, onClose]);

  return (
    <>
      <IconButton
        disabled={addUserEventRsvpMutation.isPending}
        id={`${menuId}-button`}
        aria-controls={isOpen ? `${menuId}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        {...getButtonProps()}
        ref={anchorEl}
      >
        <MdEdit />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl.current}
        {...getDisclosureProps()}
        MenuListProps={{
          "aria-labelledby": `${menuId}-button`,
        }}
      >
        <MenuItem onClick={checkinUserNow}>Check-in now</MenuItem>
        <MenuItem onClick={checkoutUserNow}>Checkout now</MenuItem>
        <MenuItem onClick={rsvpEventTime}>RSVP event time</MenuItem>
        <MenuItem onClick={clearCheckinCheckout}>
          Clear check-in/checkout
        </MenuItem>
        <Divider />
        <MenuItem onClick={onClose}>Close</MenuItem>
      </Menu>
    </>
  );
}
