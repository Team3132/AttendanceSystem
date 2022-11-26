import { Button, ButtonGroup } from "@chakra-ui/react";
import { Rsvp } from "@generated";
import { useEventRSVPStatus, useUpdateEventRSVPStatus } from "@hooks";

export interface RSVPButtonRowProps {
  eventId?: string;
}

export const RSVPButtonRow: React.FC<RSVPButtonRowProps> = ({ eventId }) => {
  const { rsvp } = useEventRSVPStatus(eventId);
  const { mutate: mutateRSVP } = useUpdateEventRSVPStatus();
  // const { mutate: globalMutate } = useSWRConfig();
  return (
    <ButtonGroup isAttached>
      <Button
        colorScheme={"green"}
        variant={rsvp?.status === Rsvp["status"].YES ? "solid" : "outline"}
        onClick={async () => {
          if (eventId) {
            mutateRSVP({
              eventId,
              rsvp: {
                status: Rsvp["status"].YES,
              },
            });
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
            mutateRSVP({
              eventId,
              rsvp: {
                status: Rsvp["status"].MAYBE,
              },
            });
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
            mutateRSVP({
              eventId,
              rsvp: {
                status: Rsvp["status"].NO,
              },
            });
          }
        }}
      >
        Not coming
      </Button>
    </ButtonGroup>
  );
};
export default RSVPButtonRow;
