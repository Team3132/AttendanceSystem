import useTotp from "@/hooks/useTotp";
import {
  Box,
  BoxProps,
  Flex,
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
  return (
    <Flex p={2} bgColor="white" borderRadius={"lg"} justifyContent={"center"}>
      <QRCode
        value={`${
          import.meta.env.VITE_BACKEND_URL
        }/event/${eventId}/token/callback?code=${secret}`}
        level="Q"
      />
    </Flex>
  );
}
