import { IconButton, ListItem, ListItemText } from "@mui/material";
import { Scancode } from "../../../api/generated";
import { FaTrash } from "react-icons/fa6";
import useDeleteScancode from "../hooks/useDeleteScancode";

interface ScancodeListItemProps {
  scancode: Scancode;
}

export default function ScancodeListItem(props: ScancodeListItemProps) {
  const { scancode } = props;

  const deleteScancodeMutation = useDeleteScancode();

  const handleDeleteScancode = () => {
    deleteScancodeMutation.mutate({
      scancodeId: scancode.code,
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
      <ListItemText primary={scancode.code} />
    </ListItem>
  );
}
