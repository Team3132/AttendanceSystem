import useTotp from "@/hooks/useTotp";
import {
  Box,
  BoxProps,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  StatProps,
} from "@chakra-ui/react";
import QRCode from "react-qr-code";

interface TotpQR extends BoxProps {
  secret: string;
  eventId: string;
}

export default function TotpQR({ secret, eventId, ...rest }: TotpQR) {
  const { timeRemaining, timeSpent, token, isLoading } = useTotp(secret);
  return (
    <Box p={2} bgColor="white" borderRadius={"lg"}>
      <QRCode
        value={`${
          import.meta.env.VITE_BACKEND_URL
        }/event/${eventId}/token/callback?code=${token}`}
        level="Q"
      />
    </Box>
  );
}
