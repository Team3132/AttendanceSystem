import { Button, ButtonGroup, ButtonGroupProps } from "@chakra-ui/react";
import { Rsvp } from "@generated";
import useEventRSVPStatus from "../hooks/useEventRSVPStatus";
import useUpdateEventRSVPStatus from "../hooks/useUpdateEventRSVPStatus";

export interface RSVPButtonRowProps extends ButtonGroupProps {
  eventId: string;
}

export const RSVPButtonRow: React.FC<RSVPButtonRowProps> = ({
  eventId,
  ...buttonGroupProps
}) => {
  const { data: rsvp } = useEventRSVPStatus(eventId);
  const updateRSVP = useUpdateEventRSVPStatus();
  // const { mutate: globalMutate } = useSWRConfig();
  return (
    <ButtonGroup {...buttonGroupProps} isAttached>
      <Button
        colorScheme={"green"}
        variant={rsvp?.status === Rsvp["status"].YES ? "solid" : "outline"}
        onClick={() =>
          updateRSVP.mutate({
            eventId,
            rsvp: {
              status: Rsvp["status"].YES,
            },
          })
        }
        isLoading={updateRSVP.isLoading}
      >
        Coming
      </Button>
      <Button
        colorScheme={"blue"}
        variant={rsvp?.status === Rsvp["status"].MAYBE ? "solid" : "outline"}
        onClick={() =>
          updateRSVP.mutate({
            eventId,
            rsvp: {
              status: Rsvp["status"].MAYBE,
            },
          })
        }
        isLoading={updateRSVP.isLoading}
      >
        Maybe
      </Button>
      <Button
        colorScheme={"red"}
        variant={rsvp?.status === Rsvp["status"].NO ? "solid" : "outline"}
        onClick={() =>
          updateRSVP.mutate({
            eventId,
            rsvp: {
              status: Rsvp["status"].NO,
            },
          })
        }
        isLoading={updateRSVP.isLoading}
      >
        Not coming
      </Button>
    </ButtonGroup>
  );
};
export default RSVPButtonRow;
