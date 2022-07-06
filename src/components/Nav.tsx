import {
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  IconButton,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAuthStatus } from "../hooks";
import { UserAvatar } from "./UserAvatar";
// import Logo from "../logo.svg";

export const Nav: React.FC = () => {
  const { isAuthenticated } = useAuthStatus();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container maxW="container.lg">
      <Flex m={3}>
        {/* <Link to="">
          <Image maxHeight={10} src={Logo} />
        </Link> */}
        <Heading size="md">Logo</Heading>

        <Spacer />
        <ButtonGroup spacing={6}>
          <IconButton
            aria-label="switch theme"
            onClick={toggleColorMode}
            className="umami--click--theme-button"
            icon={colorMode === "dark" ? <MdDarkMode /> : <MdLightMode />}
          />
          {isAuthenticated ? (
            <Button leftIcon={<UserAvatar size="sm" />} as={Link} to="/profile">
              My Profile
            </Button>
          ) : null}
        </ButtonGroup>
      </Flex>
    </Container>
  );
};
