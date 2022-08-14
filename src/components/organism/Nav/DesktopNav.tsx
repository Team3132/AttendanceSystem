import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { NavItem } from ".";

const DesktopNav: React.FC<{ menuItems: NavItem[] }> = ({
  menuItems,
  ...props
}) => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack {...props}>
      {menuItems.map((navItem, menuIndex) => {
        if (navItem.subitems) {
          return (
            <Menu key={menuIndex}>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                disabled={navItem.disabled}
                variant={"ghost"}
                leftIcon={navItem.icon}
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
              leftIcon={navItem.icon}
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

export default DesktopNav;
