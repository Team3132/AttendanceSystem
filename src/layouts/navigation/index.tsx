import { UserAvatar } from "@/features/user";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Container,
  Flex,
  Icon,
  IconButton,
  Spacer,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import loadable from "@loadable/component";
import { ReactElement, useEffect } from "react";
import {
  MdAccountCircle,
  MdCalendarToday,
  MdHome,
  MdLock
} from "react-icons/md";

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

  isAuthenticated
    ? {
        label: "Profile",
        icon: <Icon as={MdAccountCircle} />,
        subitems: [
          { url: "/profile", label: "Your Profile" },
          { url: "/codes", label: "Codes" },
          {
            url: `${import.meta.env.VITE_BACKEND_URL}/auth/discord`,
            label: "Logout",
            external: true,
          },
        ],
      }
    : {
        icon: <Icon as={MdAccountCircle} />,
        label: "Login",
        url: `${import.meta.env.VITE_BACKEND_URL}/auth/discord`,
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
        <UserAvatar size="sm" />
      </Flex>
    </Container>
  );
}
