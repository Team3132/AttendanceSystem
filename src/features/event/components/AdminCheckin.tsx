import { RSVPList } from "@/features/rsvp";
import { ScancodeInput } from "@/features/scancode";
import { EventResponseType } from "@/generated";
import { StatGroup } from "@chakra-ui/react";
import EventTotpStat from "./EventTotpStat";

interface AdminCheckinProps {
  event: EventResponseType;
}

export default function AdminCheckin(props: AdminCheckinProps) {
  const { event } = props;

  return (
    <>
      <ScancodeInput eventId={event.id} />
      <StatGroup p={5} textAlign="center">
        <EventTotpStat eventId={event.id} />
      </StatGroup>

      <RSVPList eventId={event.id} />
    </>
  );
}
