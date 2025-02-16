import ControlledSelect from "@/components/ControlledSelect";
import useZodForm from "@/hooks/useZodForm";
import { eventQueryOptions } from "@/queries/events.queries";
import { Route } from "@/routes/_authenticated/events/$eventId";
import { RSVPStatusSchema } from "@/server/schema";
import {} from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import useUpdateRsvp from "../hooks/useUpdateRsvp";

const FormSchema = z.object({
  status: RSVPStatusSchema.nullable(),
});

export default function MyRsvpStatus() {
  const { eventId } = Route.useParams();

  const myRsvpStatusQuery = useSuspenseQuery(
    eventQueryOptions.eventRsvp(eventId),
  );

  const updateRsvpMutation = useUpdateRsvp();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useZodForm({
    schema: FormSchema,
    defaultValues: {
      status: myRsvpStatusQuery.data?.status ?? undefined,
    },
  });

  const onSubmit = handleSubmit((data) =>
    updateRsvpMutation.mutateAsync({
      data: {
        eventId,
        status: data.status,
      },
    }),
  );

  useEffect(() => {
    // If the data from the server changes then update it on the client
    if (myRsvpStatusQuery.data !== null) {
      // Use reset to that it isn't considered an "update"
      reset({
        status: myRsvpStatusQuery.data.status,
      });
    }
  }, [reset, myRsvpStatusQuery.data]);

  useEffect(() => {
    // Create a subscription to the form's values so that
    // data is submitted on change
    const subscription = watch(() => onSubmit());

    return () => subscription.unsubscribe();
  }, [watch, onSubmit]);

  const disabled = useMemo(
    () => myRsvpStatusQuery.data?.status === "ATTENDED" || isSubmitting,
    [myRsvpStatusQuery.data?.status, isSubmitting],
  );

  return (
    <ControlledSelect
      control={control}
      name="status"
      label="RSVP Status"
      disabled={disabled}
      options={[
        {
          value: "LATE",
          label: "Late",
        },
        { value: "MAYBE", label: "Maybe" },
        { value: "NO", label: "No" },
        { value: "YES", label: "Yes", divider: true },
        { value: "ATTENDED", label: "Attended", disabled: true },
      ]}
      helperText="Select your RSVP status"
    />
  );
}
