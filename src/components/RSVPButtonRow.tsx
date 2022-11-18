import { api } from "@/client";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Rsvp } from "@generated";
import { useEventRSVPStatus } from "@hooks";

export interface RSVPButtonRowProps {
  eventId?: string;
}

export const RSVPButtonRow: React.FC<RSVPButtonRowProps> = ({ eventId }) => {
  const { rsvp, mutate } = useEventRSVPStatus(eventId);
  // const { mutate: globalMutate } = useSWRConfig();
  return (
    <ButtonGroup isAttached>
      <Button
        colorScheme={"green"}
        variant={rsvp?.status === Rsvp["status"].YES ? "solid" : "outline"}
        onClick={async () => {
          if (eventId) {
            // const response = await setEventRSVPStatus(
            //   eventId,
            //   Rsvp["status"].YES
            // );

            const response = api.event.eventControllerSetEventRsvp(eventId, {
              status: Rsvp["status"].YES,
            });

            mutate(response, { revalidate: false });
            // globalMutate(`https://api.team3132.com/event/${eventId}/rsvps`);
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
            const response = api.event.eventControllerSetEventRsvp(eventId, {
              status: Rsvp["status"].MAYBE,
            });

            mutate(response, { revalidate: false });
            // globalMutate(`https://api.team3132.com/event/${eventId}/rsvps`);
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
            const response = api.event.eventControllerSetEventRsvp(eventId, {
              status: Rsvp["status"].NO,
            });

            mutate(response, { revalidate: false });
            // globalMutate(`https://api.team3132.com/event/${eventId}/rsvps`);
          }
        }}
      >
        Not coming
      </Button>
    </ButtonGroup>
  );
};
export default RSVPButtonRow;
