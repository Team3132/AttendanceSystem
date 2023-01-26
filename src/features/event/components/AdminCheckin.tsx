import { ScancodeInput } from "@/features/scancode";
import { EventResponseType } from "@/generated";
import { Heading, IconButton, Stack, StatGroup } from "@chakra-ui/react";
import { useRef } from "react";
import { MdFullscreen } from "react-icons/md";
import EventTotpStat from "./EventTotpStat";

interface AdminCheckinProps {
  event: EventResponseType;
}

export default function AdminCheckin(props: AdminCheckinProps) {
  const { event } = props;

  return (
    <Stack alignContent={"center"} bgColor={"chakra-body-bg"} p={5}>
      <Heading size="lg" textAlign={"center"}>
        {event.title}
      </Heading>
      <StatGroup p={5} textAlign="center">
        <EventTotpStat eventId={event.id} />
      </StatGroup>
      <ScancodeInput eventId={event.id} />

      {/* <RSVPList eventId={event.id} /> */}
    </Stack>
  );
}
