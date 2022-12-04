import { RSVPList } from "@/features/rsvp";
import { EventResponseType } from "@/generated";
import { Center } from "@chakra-ui/react";
import RSVPButtonRow from "./RSVPButtonRow";

interface AttendanceProps {
  event: EventResponseType;
}

export default function RSVPStatus(props: AttendanceProps) {
  return (
    <>
      <Center>
        <RSVPButtonRow eventId={props.event.id} />
      </Center>

      <RSVPList eventId={props.event.id} />
    </>
  );
}
