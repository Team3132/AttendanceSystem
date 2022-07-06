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
import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { UserAvatar } from "./UserAvatar";
// import Logo from "../logo.svg";

export const Nav: React.FC = () => {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();
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
          <Button leftIcon={<UserAvatar size="sm" />}>My Profile</Button>
        </ButtonGroup>
      </Flex>
    </Container>
  );
};
