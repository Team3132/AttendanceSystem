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
  Flex,
  IconButton,
  Spacer,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { NavItem } from ".";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: NavItem[];
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  menuItems,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left">
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
                        leftIcon={navItem.icon}
                        borderRadius={0}
                        width="100%"
                        onClick={() => {
                          if (navItem.url) {
                            if (navItem.external) {
                              window.location.href = navItem.url;
                            } else {
                              navigate(navItem.url);
                              onClose();
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
                              leftIcon={subItem.icon}
                              onClick={() => {
                                if (subItem.url) {
                                  if (subItem.external) {
                                    window.location.href = subItem.url;
                                  } else {
                                    navigate(subItem.url);
                                    onClose();
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
