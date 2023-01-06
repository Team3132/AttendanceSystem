import { UserAvatar } from "@/features/user";
import api from "@/services/api";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import loadable from "@loadable/component";
import { ReactElement, useEffect } from "react";
import { MdCalendarToday, MdHome, MdLock } from "react-icons/md";
import { Link } from "react-router-dom";

export interface NavItem {
  url?: string;
  label: string;
  icon?: ReactElement<any, any>;
  disabled?: boolean;
  external?: boolean;
  subitems?: Omit<NavItem, "subitems">[];
}

const DesktopNav = loadable(() => import("./DesktopNav"));
const MobileDrawer = loadable(() => import("./MobileDrawer"));

const navItems = (isAuthenticated?: boolean, isAdmin?: boolean): NavItem[] => [
  { url: "/", label: "Home", icon: <Icon as={MdHome} /> },
  ...(isAuthenticated
    ? [
        {
          label: "Calendar",
          icon: <Icon as={MdCalendarToday} />,
          url: "/calendar",
        },
      ]
    : []),
  ...(isAdmin
    ? [
        {
          label: "Admin",
          icon: <Icon as={MdLock} />,
          url: "/admin",
        },
      ]
    : []),
];

interface NavProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export default function Navigation({ isAuthenticated, isAdmin }: NavProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const isMobile = useBreakpointValue<boolean>({ base: true, md: false });
  const menuItems = navItems(isAuthenticated, isAdmin);
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
        {isMobile ? (
          <MobileDrawer
            isOpen={isOpen}
            onClose={onClose}
            menuItems={menuItems}
          />
        ) : (
          <DesktopNav menuItems={menuItems} />
        )}

        <Spacer />
        <Menu>
          <MenuButton
            leftIcon={<UserAvatar size="sm" />}
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            Profile
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} to="/profile">
              Your Profile
            </MenuItem>
            <MenuItem as={Link} to="/codes">
              Codes
            </MenuItem>
            <MenuItem onClick={() => api.auth.signout()}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Container>
  );
}
