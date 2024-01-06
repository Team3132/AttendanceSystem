import { useDisclosure } from "@/hooks/useDisclosure";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Delete, MoreVert } from "@mui/icons-material";
import { useId, useRef } from "react";
import { trpc } from "@/trpcClient";

interface BuildPointMenuProps {
  buildPointId: string;
}

export default function BuildPointMenu(props: BuildPointMenuProps) {
  const { buildPointId } = props;

  const trpcUtils = trpc.useUtils();

  const { getButtonProps, getDisclosureProps, isOpen, onClose } =
    useDisclosure();

  const removeBuildPointMutation = trpc.users.removeBuildPoints.useMutation({
    onSuccess: (data) => {
      trpcUtils.users.getUserBuildPoints.invalidate({
        userId: data.userId,
      });
    },
    onSettled: onClose,
  });

  const handleRemoveBuildPoint = () => {
    removeBuildPointMutation.mutate({
      buildPointId,
    });
  };

  const id = useId();

  const buttonId = `build-point-menu-button-${id}`;
  const menuId = `build-point-menu-${id}`;

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <IconButton
        {...getButtonProps()}
        ref={buttonRef}
        id={buttonId}
        aria-controls={isOpen ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
      >
        <MoreVert />
      </IconButton>
      <Menu
        {...getDisclosureProps()}
        anchorEl={buttonRef.current}
        id={menuId}
        MenuListProps={{
          "aria-labelledby": buttonId,
        }}
      >
        <MenuItem onClick={handleRemoveBuildPoint}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Remove</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
