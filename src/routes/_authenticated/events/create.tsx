import ControlledSelect from "@/components/ControlledSelect";
import ControlledTextField from "@/components/ControlledTextField";
import useCreateEvent from "@/features/events/hooks/useCreateEvent";
import useZodForm from "@/hooks/useZodForm";
import { authQueryOptions } from "@/queries/auth.queries";
import { CreateEventSchema } from "@/server/schema";
import { Button, Stack, Switch } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DateTime } from "luxon";
import { Controller } from "react-hook-form";

export const Route = createFileRoute("/_authenticated/events/create")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const { isAdmin } = await queryClient.ensureQueryData(
      authQueryOptions.status(),
    );
    if (!isAdmin) {
      return {
        redirect: {
          to: "/",
        },
      };
    }
  },
  head: () => ({
    meta: [
      {
        title: "Create Event",
      },
    ],
  }),
  component: Component,
});

function Component() {
  const {
    register,
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useZodForm({
    schema: CreateEventSchema,
    defaultValues: {
      description: "",
      title: "",
      startDate: new Date(),
      endDate: new Date(),
      allDay: false,
      type: "Regular",
    },
  });

  const navigate = useNavigate();

  const createEventMutation = useCreateEvent();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const createdEvent = await createEventMutation.mutateAsync({ data });
      navigate({
        to: "/events/$eventId",
        params: {
          eventId: createdEvent.id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Stack gap={2} py={2} component={"form"} onSubmit={onSubmit}>
      <ControlledTextField control={control} name="title" label="Title" />
      <ControlledTextField
        control={control}
        name="description"
        label="Description"
        multiline
        rows={3}
      />
      <Controller
        control={control}
        name="startDate"
        render={({ field: { onChange, value, ...rest } }) => (
          <DateTimePicker
            label="Start Date"
            value={DateTime.fromJSDate(value)}
            onChange={(v) => onChange(v?.toISO() ?? "")}
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="endDate"
        render={({ field: { onChange, value, ...rest } }) => (
          <DateTimePicker
            label="End Date"
            value={DateTime.fromJSDate(value)}
            onChange={(v) => onChange(v?.toJSDate() ?? "")}
            {...rest}
          />
        )}
      />
      <Switch {...register("allDay")} />
      <ControlledSelect
        control={control}
        name="type"
        label="Type"
        slotProps={{
          select: {
            displayEmpty: true,
          },
        }}
        options={[
          { label: "All", value: undefined },
          { label: "Outreach", value: "Outreach" },
          { label: "Regular", value: "Regular" },
          { label: "Social", value: "Social" },
        ]}
      />
      <Button loading={isSubmitting} type="submit">
        Create
      </Button>
    </Stack>
  );
}
