import { Container, Stack, Switch } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import ensureAuth from "../../auth/utils/ensureAuth";
import useZodForm from "../../../hooks/useZodForm";
import { DateTime } from "luxon";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import useCreateEvent from "../hooks/useCreateEvent";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import ControlledTextField from "@/components/ControlledTextField";
import ControlledSelect from "@/components/ControlledSelect";
import { CreateEventSchema } from "newbackend/schema";

export async function loader() {
  const initialAuthData = await ensureAuth(true);
  return {
    initialAuthData,
  };
}

export function Component() {
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
      startDate: DateTime.now().toISODate() ?? undefined,
      endDate: DateTime.now().toISODate() ?? undefined,
      allDay: false,
      type: "Regular",
    },
  });

  const navigate = useNavigate();
  const alert = useAlert();

  const createEventMutation = useCreateEvent();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const createdEvent = await createEventMutation.mutateAsync(data);
      alert.success("Event created");
      navigate(`/events/${createdEvent.id}`);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <DefaultAppBar title="Create Event" />
      <Container sx={{ overflow: "auto" }}>
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
                value={DateTime.fromISO(value ?? "")}
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
                value={DateTime.fromISO(value ?? "")}
                onChange={(v) => onChange(v?.toISO() ?? "")}
                {...rest}
              />
            )}
          />
          <Switch {...register("allDay")} />
          <ControlledSelect
            control={control}
            name="type"
            label="Type"
            displayEmpty={true}
            options={[
              { label: "All", value: undefined },
              { label: "Outreach", value: "Outreach" },
              { label: "Regular", value: "Regular" },
              { label: "Social", value: "Social" },
            ]}
          />
          <LoadingButton loading={isSubmitting} type="submit">
            Create
          </LoadingButton>
        </Stack>
      </Container>
    </>
  );
}
