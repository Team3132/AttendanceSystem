import { useDisclosure } from "@/hooks/useDisclosure";
import useLogout from "@/hooks/useLogout";
import {
  AppBar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {} from "@tanstack/react-query";
import { useCallback, useId, useRef } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { LinkMenuItem } from "./LinkMenuItem";
import ModeSwitchButton from "./ModeSwitchButton";

const GrowingTypography = styled(Typography)({
  flexGrow: 1,
});

const SpacedToolbar = styled(Toolbar)(({ theme }) => ({
  gap: theme.spacing(1),
}));

export default function TopBar() {
  return (
    <AppBar position="static">
      <SpacedToolbar>
        <GrowingTypography variant="h6" as="div">
          TDU Attendance
        </GrowingTypography>
        <ModeSwitchButton />
        <ProfileMenu />
      </SpacedToolbar>
    </AppBar>
  );
}

function ProfileMenu() {
  const { getDisclosureProps, getButtonProps, isOpen } = useDisclosure();
  const anchorEl = useRef(null);

  const menuId = useId();

  return (
    <>
      <IconButton
        id={`${menuId}-button`}
        aria-controls={isOpen ? `${menuId}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        {...getButtonProps()}
        ref={anchorEl}
      >
        <FaCircleUser />
      </IconButton>
      <Menu
        id={`${menuId}-menu`}
        anchorEl={anchorEl.current}
        {...getDisclosureProps()}
        MenuListProps={{
          "aria-labelledby": `${menuId}-button`,
        }}
      >
        <LinkMenuItem to="/profile">Profile</LinkMenuItem>
        <Divider />
        <LogoutMenuButton />
      </Menu>
    </>
  );
}

function LogoutMenuButton() {
  const logout = useLogout();

  const logoutHandler = useCallback(
    () => logout.mutate({ data: undefined }),
    [logout.mutate],
  );

  return <MenuItem onClick={logoutHandler}>Logout</MenuItem>;
}
