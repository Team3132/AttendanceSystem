import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  Container,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAuthStatus } from "../hooks";
import { TDUIcon } from "./TDUIcon";
import { UserAvatar } from "./UserAvatar";
// import Logo from "../logo.svg";

export const Nav: React.FC = () => {
  const { isAuthenticated } = useAuthStatus();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container maxW="container.lg">
      <Flex m={3}>
        <IconButton
          aria-label="TDU Logo"
          color="#1C3B1E"
          icon={<TDUIcon h={"2em"} w={"2em"} />}
          variant={"ghost"}
          as={Link}
          to="/"
          p={0}
          m={0}
        />

        <Spacer />
        <ButtonGroup spacing={6}>
          <IconButton
            aria-label="switch theme"
            onClick={toggleColorMode}
            className="umami--click--theme-button"
            icon={colorMode === "dark" ? <MdDarkMode /> : <MdLightMode />}
          />
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                leftIcon={<UserAvatar size="sm" />}
              >
                My Profile
              </MenuButton>
              <MenuList zIndex={5}>
                <MenuItem as={Link} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem as={Link} to="/codes">
                  Codes
                </MenuItem>
                <MenuItem as="a" href="/api/auth/logout">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button as="a" href="/api/auth/discord">
              Login
            </Button>
          )}
        </ButtonGroup>
      </Flex>
    </Container>
  );
};
