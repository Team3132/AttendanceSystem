import {
  Button,
  Center,
  Container,
  Divider,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useAuthStatus } from "@hooks";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStatus();
  return (
    <Container maxW="container.md">
      <Heading textAlign={"center"} mt={6}>
        Welcome to TDU's Attendance Site
      </Heading>
      <Divider my={6} />
      <Text textAlign={"center"}>
        This is where the students in the Thunder Down Under Robotics team can
        record their attendance.
      </Text>
      <Divider my={6} />
      <Center>
        {isAuthenticated ? (
          <Button as={Link} to="/calendar">
            View Calendar
          </Button>
        ) : (
          <Button
            as={"a"}
            href={`${import.meta.env.VITE_BACKEND_URL}/auth/discord`}
          >
            Login
          </Button>
        )}
      </Center>
    </Container>
  );
};
export default Home;
