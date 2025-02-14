import ControlledSelect from "@/components/ControlledSelect";
import useZodForm from "@/hooks/useZodForm";
import { eventQueryOptions } from "@/queries/events.queries";
import { RSVPStatusSchema } from "@/server/schema";
import {} from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import useUpdateRsvp from "../hooks/useUpdateRsvp";

interface MyRsvpStatusProps {
  eventId: string;
}

const FormSchema = z.object({
  status: RSVPStatusSchema.nullable(),
});

export default function MyRsvpStatus(props: MyRsvpStatusProps) {
  const { eventId } = props;

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
      status: myRsvpStatusQuery.data?.status ?? null,
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
    if (myRsvpStatusQuery.data) {
      reset({
        status: myRsvpStatusQuery.data.status,
      });
    }
  }, [reset, myRsvpStatusQuery.data]);

  useEffect(() => {
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
        { value: "YES", label: "Yes" },
        { value: "ATTENDED", label: "Attended", disabled: true },
      ]}
    />
  );
}
