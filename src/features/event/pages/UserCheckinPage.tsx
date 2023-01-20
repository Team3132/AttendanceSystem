import { useAuthStatus } from "@/features/auth";
import { Container, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import UserCheckin from "../components/UserCheckin";
import useEvent from "../hooks/useEvent";

export default function UserCheckinPage() {
  const { eventId } = useParams();
  const event = useEvent(eventId);
  const auth = useAuthStatus();

  if (!event.isSuccess || !auth.isSuccess) {
    return <Spinner />;
  }

  return (
    <Container maxW="container.sm">
      <UserCheckin event={event.data} />
    </Container>
  );
}
