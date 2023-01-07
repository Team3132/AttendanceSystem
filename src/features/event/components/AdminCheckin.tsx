import { ScancodeInput } from "@/features/scancode";
import { EventResponseType } from "@/generated";
import { IconButton, Stack, StatGroup } from "@chakra-ui/react";
import { useRef } from "react";
import { MdFullscreen } from "react-icons/md";
import EventTotpStat from "./EventTotpStat";

interface AdminCheckinProps {
  event: EventResponseType;
}

export default function AdminCheckin(props: AdminCheckinProps) {
  const { event } = props;
  const adminScreenRef = useRef<HTMLDivElement | null>(null);

  const handleFullscreen: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    adminScreenRef.current?.requestFullscreen();
  };

  return (
    <Stack alignContent={"center"}  position="relative" bgColor={"chakra-body-bg"} ref={adminScreenRef} p={5}>
      <IconButton
        icon={<MdFullscreen />}
        position="absolute"
        right={5}
        bottom="auto"
        top={5}
        aria-label={"Fullscreen"}
        onClick={handleFullscreen}
      />
      <StatGroup p={5} textAlign="center">
        <EventTotpStat eventId={event.id} />
      </StatGroup>
      <ScancodeInput eventId={event.id} />

      {/* <RSVPList eventId={event.id} /> */}
    </Stack>
  );
}
