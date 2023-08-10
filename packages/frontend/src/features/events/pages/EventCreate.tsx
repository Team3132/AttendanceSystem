import {
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import ensureAuth from "../../auth/utils/ensureAuth";
import { z } from "zod";
import { CreateEventDto } from "../../../api/generated";
import useZodForm from "../../../hooks/useZodForm";
import { DateTime } from "luxon";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import useCreateEvent from "../hooks/useCreateEvent";

export async function loader() {
  const initialAuthData = await ensureAuth(true);
  return {
    initialAuthData,
  };
}

const EventCreateSchema = z.object({
  description: z.string().default(""),
  title: z.string().default(""),
  startDate: z.string(),
  endDate: z.string(),
  allDay: z.boolean().default(false),
  type: z.nativeEnum(CreateEventDto.type).default(CreateEventDto.type.REGULAR),
  roles: z.array(z.string()).default([]),
});

export function Component() {
  const {
    register,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useZodForm({
    schema: EventCreateSchema,
    defaultValues: {
      description: "",
      title: "",
      startDate: DateTime.now().toISODate() ?? undefined,
      endDate: DateTime.now().toISODate() ?? undefined,
      allDay: false,
      type: CreateEventDto.type.REGULAR,
    },
  });

  const createEventMutation = useCreateEvent();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const parsed = EventCreateSchema.parse(data);
      await createEventMutation.mutateAsync(parsed);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <DefaultAppBar title="Create Event" />
      <Container sx={{ overflow: "auto" }}>
        <Stack gap={2} py={2} component={"form"} onSubmit={onSubmit}>
          <TextField label="Title" {...register("title")} />
          <TextField
            label="Description"
            {...register("description")}
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
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
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel id="select-event-type-label">Type</InputLabel>
                <Select
                  labelId="select-event-type-label"
                  id="select-event-type"
                  value={value}
                  onChange={onChange}
                  displayEmpty={false}
                  label="Type"
                  {...rest}
                >
                  <MenuItem value={CreateEventDto.type.OUTREACH}>
                    Outreach
                  </MenuItem>
                  <MenuItem value={CreateEventDto.type.REGULAR}>
                    Regular
                  </MenuItem>
                  <MenuItem value={CreateEventDto.type.SOCIAL}>Social</MenuItem>
                </Select>
                {errors.type ? (
                  <FormHelperText error>{errors.type.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <LoadingButton loading={isSubmitting} type="submit">
            Create
          </LoadingButton>
        </Stack>
      </Container>
    </>
  );
}
