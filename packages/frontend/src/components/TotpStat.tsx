import useTotp from "@/hooks/useTotp";
import {
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  StatProps,
} from "@chakra-ui/react";

interface TotpStatProps extends StatProps {
  secret: string;
}

export default function TotpStat({ secret, ...rest }: TotpStatProps) {
  const { timeRemaining, timeSpent, token, isLoading } = useTotp(secret);
  return (
    <Stat {...rest} fontFamily={"monospace"}>
      <StatLabel>Event Code</StatLabel>
      <StatNumber>{!token.length ? "Loading..." : token}</StatNumber>
      <StatHelpText>{timeRemaining} Seconds until expiry</StatHelpText>
    </Stat>
  );
}
