import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
  ButtonGroup,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  IconButton,
  Spacer,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { NavItem } from ".";
import { useAuthStatus } from "../../hooks";

const MobileDrawer: React.FC<
  Omit<DrawerProps, "children"> & { menuItems: NavItem[] }
> = ({ menuItems, ...props }) => {
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
              {menuItems.map((navItem, accordionIndex) => {
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

export default MobileDrawer;
