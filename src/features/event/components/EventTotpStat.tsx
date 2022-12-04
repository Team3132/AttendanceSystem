import TotpStat from "@/components/TotpStat";
import { StatProps } from "@chakra-ui/react";
import useEventToken from "../hooks/useEventToken";

interface TotpTokenProps extends StatProps {
  eventId: string;
}

export default function EventTotpStat(props: TotpTokenProps) {
  const { eventId, ...rest } = props;

  const eventToken = useEventToken(eventId);

  if (!eventToken.isSuccess) {
    return null;
  }

  return <TotpStat secret={eventToken.data.secret} {...rest} />;
}
