import TotpQR from "@/components/TotpQR";
import { ScancodeInput } from "@/features/scancode";
import { EventResponseType } from "@/generated";
import {
  Flex,
  Heading,
  IconButton,
  Spacer,
  Stack,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useRef } from "react";
import { MdFullscreen } from "react-icons/md";
import useEventToken from "../hooks/useEventToken";
import EventTotpStat from "./EventTotpStat";

interface AdminCheckinProps {
  event: EventResponseType;
}

export default function AdminCheckin(props: AdminCheckinProps) {
  const { event } = props;

  const eventToken = useEventToken(event.id);

  return (
    <Stack
      alignContent={"center"}
      bgColor={"chakra-body-bg"}
      p={5}
      justifyContent={"center"}
    >
      <Heading size="lg" textAlign={"center"}>
        {event.title}
      </Heading>
      {eventToken.isSuccess && (
        <>
          <Stat textAlign={"center"}>
            <StatLabel>Event Code</StatLabel>
            <StatNumber>{eventToken.data.secret}</StatNumber>
            <StatHelpText>
              Enter this code on the website underneath event user checkin tab
            </StatHelpText>
          </Stat>
          <TotpQR eventId={event.id} secret={eventToken.data.secret} />
        </>
      )}
      <ScancodeInput eventId={event.id} />

      {/* <RSVPList eventId={event.id} /> */}
    </Stack>
  );
}
