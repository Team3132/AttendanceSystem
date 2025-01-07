import { IconButton, ListItem, ListItemText } from "@mui/material";
import { FaTrash } from "react-icons/fa6";
import useDeleteSelfScancode from "../hooks/useDeleteSelfScancode";

interface ScancodeListItemProps {
	code: string;
}

export default function ScancodeListItem(props: ScancodeListItemProps) {
	const { code } = props;

	const deleteScancodeMutation = useDeleteSelfScancode();

	const handleDeleteScancode = () => {
		deleteScancodeMutation.mutate({ data: code });
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
			<ListItemText primary={code} />
		</ListItem>
	);
}
