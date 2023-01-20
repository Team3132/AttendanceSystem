import { useAuthStatus } from "@/features/auth";
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Stack,
} from "@chakra-ui/react";
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
    <Flex h="100vh" flexDir={"column"}>
      <Spacer />
      <Container maxW="container.sm">
          
          <AdminCheckin event={event.data} />
      </Container>
      <Spacer />
    </Flex>
  );
}
