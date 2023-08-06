import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  ButtonProps,
} from "@chakra-ui/react";
import { Rsvp } from "@generated";
import useEventRSVPStatus from "../hooks/useEventRSVPStatus";
import useUpdateEventRSVPStatus from "../hooks/useUpdateEventRSVPStatus";
import StatusButton from "./StatusButton";

export interface RSVPButtonRowProps extends ButtonGroupProps {
  eventId: string;
}

export const RSVPButtonRow: React.FC<RSVPButtonRowProps> = ({
  eventId,
  ...buttonGroupProps
}) => {
  return (
    <ButtonGroup {...buttonGroupProps} isAttached>
      <StatusButton
        colorScheme={"green"}
        status={Rsvp["status"].YES}
        eventId={eventId}
      >
        Coming
      </StatusButton>
      <StatusButton
        colorScheme={"blue"}
        status={Rsvp["status"].MAYBE}
        eventId={eventId}
      >
        Maybe
      </StatusButton>
      <StatusButton
        colorScheme={"red"}
        status={Rsvp["status"].NO}
        eventId={eventId}
      >
        Not coming
      </StatusButton>
      <StatusButton
        colorScheme={"orange"}
        status={Rsvp["status"].LATE}
        eventId={eventId}
      >
        Late
      </StatusButton>
    </ButtonGroup>
  );
};

export default RSVPButtonRow;
