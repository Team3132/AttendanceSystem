import { Rsvp } from "@/generated";
import { Box, Button } from "@chakra-ui/react";
import useCheckout from "../hooks/useCheckout";

interface ActiveEventProps {
  rsvp: Rsvp;
}

export default function ActiveEvent(props: ActiveEventProps) {
  const { rsvp } = props;

  const checkoutMutation = useCheckout();

  const handleCheckout = () => {
    checkoutMutation.mutate(rsvp.eventId);
  };

  return (
    <Box
      borderRadius={"md"}
      borderWidth={"thin"}
      borderColor={"ActiveBorder"}
      p={2}
    >
      <Box>{rsvp.id}</Box>
      <Button onClick={handleCheckout} isLoading={checkoutMutation.isLoading}>
        Checkout
      </Button>
    </Box>
  );
}
