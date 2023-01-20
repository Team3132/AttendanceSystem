import { useAuthStatus } from "@/features/auth";
import { Container, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import AdminCheckin from "../components/AdminCheckin";
import useEvent from "../hooks/useEvent";

export default function AdminCheckinPage() {
  const { eventId } = useParams();
  const event = useEvent(eventId);
  const auth = useAuthStatus();

  if (!event.isSuccess || !auth.isSuccess) {
    return <Spinner />;
  }

  return (
    <Container maxW="container.md">
      <AdminCheckin event={event.data} />
    </Container>
  );
}
