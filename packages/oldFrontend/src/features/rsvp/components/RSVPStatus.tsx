import { RSVPList } from "@/features/rsvp";
import { EventResponseType } from "@/generated";
import { Center, Heading, Stack } from "@chakra-ui/react";
import RSVPButtonRow from "./RSVPButtonRow";

export interface AttendanceProps {
  event: EventResponseType;
}

export default function RSVPStatus(props: AttendanceProps) {
  return (
    <>
      <Center>
        <Stack borderWidth={"thin"} borderRadius="md" p={5} spacing={5}>
          <Heading size={"md"} textAlign="center">
            Your Status
          </Heading>

          <RSVPButtonRow eventId={props.event.id} />
        </Stack>
      </Center>

      <RSVPList eventId={props.event.id} />
    </>
  );
}
