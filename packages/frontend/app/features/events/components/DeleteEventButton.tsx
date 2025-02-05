import { authQueryOptions } from "@/queries/auth.queries";
import { Button } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import useDeleteEvent from "../hooks/useDeleteEvent";

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
    <Button onClick={handleDelete} loading={deleteEventMutation.isPending}>
      Delete Event
    </Button>
  );
}
