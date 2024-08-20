import {
  AppBar,
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { FaCircleUser } from "react-icons/fa6";
import AsChildLink from "./AsChildLink";
import OnlineCountComponent from "./OnlineCount";
import { useCallback, useRef, useState } from "react";
import { Logout } from "@mui/icons-material";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryUtils, trpc } from "@/trpcClient";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

interface DefaultAppBarProps {
  title: string;
}

export default function DefaultAppBar({ title }: DefaultAppBarProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const buttonRef = useRef<HTMLElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.log("Already logged out", error);
    }

    queryClient.clear();
    queryUtils.auth.status.invalidate();
    navigate({
      to: "/login",
    });
    onClose();
  }, [logoutMutation.mutateAsync, queryClient.clear, onClose, navigate]);

  return (
    <>
      <Helmet>
        <title>{`${title} - Attendance System`}</title>
      </Helmet>
      <AppBar
        position="absolute"
        sx={{
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Tooltip title="Account settings">
            <IconButton
              onClick={onToggle}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={isOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isOpen ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={buttonRef.current}
            id="account-menu"
            open={isOpen}
            onClose={onClose}
            onClick={onClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <AsChildLink to="/profile">
              <MenuItem>
                <Avatar /> Profile
              </MenuItem>
            </AsChildLink>
            <AsChildLink to="/profile/pending">
              <MenuItem>
                <Avatar /> Pending Checkouts
              </MenuItem>
            </AsChildLink>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
