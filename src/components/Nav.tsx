import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
  ButtonGroup,
  Center,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  StackProps,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStatus } from "../hooks";
import { UserAvatar } from "./UserAvatar";
// import Logo from "../logo.svg";

const navItems = (isAuthenticated?: boolean): NavItem[] => [
  { url: "/", label: "Home" },
  ...(isAuthenticated
    ? [
        {
          label: "Calendar",
          subitems: [
            { url: "/calendar", label: "Full" },
            { url: "/calendar/agenda", label: "Agenda" },
            { url: "/calendar/custom", label: "Custom" },
          ],
        },
      ]
    : []),

  isAuthenticated
    ? {
        label: "Profile",
        subitems: [
          { url: "/profile", label: "Your Profile" },
          { url: "/codes", label: "Codes" },
          { url: "/api/auth/logout", label: "Logout", external: true },
        ],
      }
    : {
        label: "Login",
        url: "/api/auth/discord",
        external: true,
      },
];

interface NavItem {
  url?: string;
  label: string;
  disabled?: boolean;
  external?: boolean;
  subitems?: Omit<NavItem, "subitems">[];
}

const DesktopNav: React.FC<StackProps> = ({ ...props }) => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated } = useAuthStatus();
  return (
    <HStack {...props}>
      {navItems(isAuthenticated).map((navItem, menuIndex) => {
        if (navItem.subitems) {
          return (
            <Menu key={menuIndex}>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                disabled={navItem.disabled}
                variant={"ghost"}
              >
                {navItem.label}
              </MenuButton>
              <MenuList>
                {navItem.subitems.map((subItem, subItemIndex) => (
                  <MenuItem
                    disabled={subItem.disabled}
                    key={subItemIndex}
                    onClick={() => {
                      if (subItem.url) {
                        if (subItem.external) {
                          window.location.href = subItem.url;
                        } else {
                          navigate(subItem.url);
                        }
                      }
                    }}
                  >
                    {subItem.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          );
        } else {
          return (
            <Button
              key={menuIndex}
              disabled={navItem.disabled}
              variant={"ghost"}
              onClick={() => {
                if (navItem.url) {
                  if (navItem.external) {
                    window.location.href = navItem.url;
                  } else {
                    navigate(navItem.url);
                  }
                }
              }}
            >
              {navItem.label}
            </Button>
          );
        }
      })}
      <IconButton
        aria-label="switch theme"
        onClick={toggleColorMode}
        icon={colorMode === "dark" ? <MdDarkMode /> : <MdLightMode />}
        variant="ghost"
      />
    </HStack>
  );
};

const MobileDrawer: React.FC<Omit<DrawerProps, "children">> = ({
  ...props
}) => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated } = useAuthStatus();
  const location = useLocation();

  return (
    <Drawer {...props}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Navigation</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          <Flex flexDir={"column"} height="100%">
            <Accordion allowMultiple>
              {navItems(isAuthenticated).map((navItem, accordionIndex) => {
                return (
                  <AccordionItem
                    isDisabled={navItem.disabled}
                    key={accordionIndex}
                  >
                    <AccordionButton>
                      <Button
                        variant={"ghost"}
                        borderRadius={0}
                        width="100%"
                        onClick={() => {
                          if (navItem.url) {
                            if (navItem.external) {
                              window.location.href = navItem.url;
                            } else {
                              navigate(navItem.url);
                              props.onClose();
                            }
                          }
                        }}
                      >
                        {navItem.label}
                      </Button>
                    </AccordionButton>
                    {navItem.subitems ? (
                      <AccordionPanel>
                        <Stack>
                          {navItem.subitems?.map((subItem, subItemIndex) => (
                            <Button
                              variant={"ghost"}
                              onClick={() => {
                                if (subItem.url) {
                                  if (subItem.external) {
                                    window.location.href = subItem.url;
                                  } else {
                                    navigate(subItem.url);
                                    props.onClose();
                                  }
                                }
                              }}
                              isDisabled={subItem.disabled}
                              borderRadius={0}
                              width="100%"
                              key={subItemIndex}
                              fontSize={"sm"}
                            >
                              {subItem.label}
                            </Button>
                          )) ?? null}
                        </Stack>
                      </AccordionPanel>
                    ) : null}
                  </AccordionItem>
                );
              })}
            </Accordion>
            <Spacer />
            <Center m={2}>
              <ButtonGroup>
                <IconButton
                  aria-label="switch theme"
                  onClick={toggleColorMode}
                  icon={colorMode === "dark" ? <MdDarkMode /> : <MdLightMode />}
                />
              </ButtonGroup>
            </Center>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export const Nav: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const isMobile = useBreakpointValue<boolean>({ base: true, md: false });
  useEffect(() => {
    if (!isMobile) {
      onClose();
    }
  }, [isMobile]);

  return (
    <Container maxW="container.lg">
      <Flex m={3}>
        <IconButton
          aria-label="menu"
          icon={<HamburgerIcon />}
          onClick={onOpen}
          hidden={!isMobile}
        />
        <MobileDrawer isOpen={isOpen} onClose={onClose} placement="left" />
        <DesktopNav hidden={isMobile} />
        <Spacer />
        <UserAvatar size="sm" />
      </Flex>
    </Container>
  );
};
