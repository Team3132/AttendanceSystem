import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Container,
  Flex,
  Icon,
  IconButton,
  Spacer,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import loadable from "@loadable/component";
import { ReactElement, useEffect } from "react";
import {
  MdAccountCircle,
  MdCalendarToday,
  MdHome,
  MdLock,
} from "react-icons/md";
import { UserAvatar } from "../..";

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
        icon: <Icon as={MdAccountCircle} />,
        subitems: [
          { url: "/profile", label: "Your Profile" },
          { url: "/codes", label: "Codes" },
          {
            url: "https://api.team3132.com/auth/logout",
            label: "Logout",
            external: true,
          },
        ],
      }
    : {
        icon: <Icon as={MdAccountCircle} />,
        label: "Login",
        url: "https://api.team3132.com/auth/discord",
        external: true,
      },
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

export const Nav: React.FC<NavProps> = ({ isAuthenticated, isAdmin }) => {
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
        <UserAvatar size="sm" />
      </Flex>
    </Container>
  );
};
export default Nav;
