import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
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
import { useSWRConfig } from "swr";
import { useAuthStatus } from "../hooks";
import { logout } from "../utils";
import { createOAuthWindow } from "./oauthWindow";
import { UserAvatar } from "./UserAvatar";
// import Logo from "../logo.svg";

export const Nav: React.FC = () => {
  const { isAuthenticated } = useAuthStatus();
  const { colorMode, toggleColorMode } = useColorMode();
  const { mutate } = useSWRConfig();
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
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                leftIcon={<UserAvatar size="sm" />}
              >
                My Profile
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    await logout();
                    window.location.reload();
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              as="a"
              onClick={() => {
                createOAuthWindow("/api/auth/discord", mutate);
              }}
            >
              Login
            </Button>
          )}
        </ButtonGroup>
      </Flex>
    </Container>
  );
};
