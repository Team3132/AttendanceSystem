import { LoadingButton } from "@mui/lab";
import useDeleteEvent from "../hooks/useDeleteEvent";

interface DeleteEventButtonProps {
  eventId: string;
}

export default function DeleteEventButton(props: DeleteEventButtonProps) {
  const deleteEventMutation = useDeleteEvent();

  const handleDelete = () => {
    deleteEventMutation.mutate({ data: props.eventId });
  };

  return (
    <LoadingButton
      onClick={handleDelete}
      loading={deleteEventMutation.isPending}
    >
      Delete Event
    </LoadingButton>
  );
}
