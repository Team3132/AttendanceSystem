import { IconButton, ListItem, ListItemText } from "@mui/material";
import { FaTrash } from "react-icons/fa6";
import useDeleteUserScancode from "../hooks/useDeleteUserScancode";

interface ScancodeListItemProps {
  scancode: string;
  userId: string;
}

export default function ScancodeListItem(props: ScancodeListItemProps) {
  const { scancode, userId } = props;

  const deleteScancodeMutation = useDeleteUserScancode();

  const handleDeleteScancode = () => {
    deleteScancodeMutation.mutate({
      data: { scancode: scancode, userId },
    });
  };

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          disabled={deleteScancodeMutation.isPending}
          onClick={handleDeleteScancode}
        >
          <FaTrash />
        </IconButton>
      }
    >
      <ListItemText primary={scancode} />
    </ListItem>
  );
}
