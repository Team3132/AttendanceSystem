import { Button, ButtonGroup } from "@chakra-ui/react";
import { Rsvp } from "@generated";
import { useEventRSVPStatus } from "@hooks";
import { setEventRSVPStatus } from "@utils";
import { useSWRConfig } from "swr";

export interface RSVPButtonRowProps {
  eventId?: string;
}

export const RSVPButtonRow: React.FC<RSVPButtonRowProps> = ({ eventId }) => {
  const { rsvp, mutate } = useEventRSVPStatus(eventId);
  const { mutate: globalMutate } = useSWRConfig();
  return (
    <ButtonGroup isAttached>
      <Button
        colorScheme={"green"}
        variant={rsvp?.status === Rsvp["status"].YES ? "solid" : "outline"}
        onClick={async () => {
          if (eventId) {
            const response = await setEventRSVPStatus(
              eventId,
              Rsvp["status"].YES
            );
            mutate(response, { revalidate: false });
            globalMutate(`/api/event/${eventId}/rsvps`);
          }
        }}
      >
        Coming
      </Button>
      <Button
        colorScheme={"blue"}
        variant={rsvp?.status === Rsvp["status"].MAYBE ? "solid" : "outline"}
        onClick={async () => {
          if (eventId) {
            const response = await setEventRSVPStatus(
              eventId,
              Rsvp["status"].MAYBE
            );
            mutate(response, { revalidate: false });
            globalMutate(`/api/event/${eventId}/rsvps`);
          }
        }}
      >
        Maybe
      </Button>
      <Button
        colorScheme={"red"}
        variant={rsvp?.status === Rsvp["status"].NO ? "solid" : "outline"}
        onClick={async () => {
          if (eventId) {
            const response = await setEventRSVPStatus(
              eventId,
              Rsvp["status"].NO
            );
            mutate(response, { revalidate: false });
            globalMutate(`/api/event/${eventId}/rsvps`);
          }
        }}
      >
        Not coming
      </Button>
    </ButtonGroup>
  );
};
export default RSVPButtonRow;
