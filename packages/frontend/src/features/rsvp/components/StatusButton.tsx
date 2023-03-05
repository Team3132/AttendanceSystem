import { Rsvp } from "@/generated";
import { Button, ButtonProps } from "@chakra-ui/react";
import useEventRSVPStatus from "../hooks/useEventRSVPStatus";
import useUpdateEventRSVPStatus from "../hooks/useUpdateEventRSVPStatus";

export interface StatusButtonProps extends ButtonProps {
  status: Rsvp["status"];
  eventId: string;
}

export default function StatusButton({
  status,
  eventId,
  ...buttonProps
}: StatusButtonProps) {
  const { data: rsvp } = useEventRSVPStatus(eventId);
  const updateRSVP = useUpdateEventRSVPStatus();

  const onClickCallback = () => {
    if (!status) return;
    updateRSVP.mutate({
      eventId,
      rsvp: {
        status,
        delay: null,
      },
    });
  };

  // const { mutate: globalMutate } = useSWRConfig();
  return (
    <Button
      variant={rsvp?.status === status ? "solid" : "outline"}
      onClick={onClickCallback}
      isLoading={updateRSVP.isLoading}
      {...buttonProps}
    >
      {status}
    </Button>
  );
}
