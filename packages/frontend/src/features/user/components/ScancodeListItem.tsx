import { IconButton, ListItem, ListItemText } from "@mui/material";
import { Scancode } from "../../../api/generated";
import { FaTrash } from "react-icons/fa6";
import useDeleteScancode from "../hooks/useDeleteScancode";
import { useParams } from "react-router-dom";

interface ScancodeListItemProps {
  scancode: Scancode;
}

export default function ScancodeListItem(props: ScancodeListItemProps) {
  const { scancode } = props;
  const { userId } = useParams<{ userId: string }>();

  const deleteScancodeMutation = useDeleteScancode();

  const handleDeleteScancode = () => {
    deleteScancodeMutation.mutate({
      scancodeId: scancode.code,
      userId,
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
