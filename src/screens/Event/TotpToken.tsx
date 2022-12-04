import {
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  StatProps,
} from "@chakra-ui/react";
import { useTotp } from "./hook";

interface TotpTokenProps extends StatProps {
  secret: string;
}

export default function TotpToken(props: TotpTokenProps) {
  const { secret, ...rest } = props;

  const { timeRemaining, timeSpent, token, isLoading } = useTotp(secret);

  return (
    <Stat {...rest} fontFamily={"monospace"}>
      <StatLabel>Token</StatLabel>
      <StatNumber>{!token.length ? "Loading..." : token}</StatNumber>
      <StatHelpText>{timeRemaining} Seconds until expiry</StatHelpText>
    </Stat>
  );
}
