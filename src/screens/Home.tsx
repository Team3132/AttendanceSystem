import {
  Button,
  Center,
  Container,
  Divider,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuthStatus } from "../hooks";

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

      {isAuthenticated ? (
        <>
          <Divider my={6} />
          <Center>
            <Button as={Link} to="/calendar">
              View Calendar
            </Button>
          </Center>
        </>
      ) : null}
    </Container>
  );
};

export default Home;
