import { LoadingButton } from "@mui/lab";
import useDeleteEvent from "../hooks/useDeleteEvent";
import { useCallback } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { authQueryOptions } from "@/queries/auth.queries";

interface DeleteEventButtonProps {
  eventId: string;
}

export default function DeleteEventButton(props: DeleteEventButtonProps) {
  const deleteEventMutation = useDeleteEvent();
  const authStatusQuery = useSuspenseQuery(authQueryOptions.status());

  const handleDelete = useCallback(() => {
    deleteEventMutation.mutate({ data: props.eventId });
  }, [deleteEventMutation, props.eventId]);

  if (!authStatusQuery.data.isAdmin) {
    return null;
  }

  return (
    <LoadingButton
      onClick={handleDelete}
      loading={deleteEventMutation.isPending}
    >
      Delete Event
    </LoadingButton>
  );
}
