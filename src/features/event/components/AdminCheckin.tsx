import { ScancodeInput } from "@/features/scancode";
import { EventResponseType } from "@/generated";
import { Stack, StatGroup } from "@chakra-ui/react";
import EventTotpStat from "./EventTotpStat";

interface AdminCheckinProps {
  event: EventResponseType;
}

export default function AdminCheckin(props: AdminCheckinProps) {
  const { event } = props;

  return (
    <Stack alignContent={"center"}>
      <StatGroup p={5} textAlign="center">
        <EventTotpStat eventId={event.id} />
      </StatGroup>
      <ScancodeInput eventId={event.id} />

      {/* <RSVPList eventId={event.id} /> */}
    </Stack>
  );
}
