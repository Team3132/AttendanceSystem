import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { z } from "zod";
import ensureAuth from "../../auth/utils/ensureAuth";
import queryClient from "../../../queryClient";
import eventApi from "../../../api/query/event.api";
import { Container, Paper, Stack, TextField, Typography } from "@mui/material";
import useZodForm from "../../../hooks/useZodForm";
import { LoadingButton } from "@mui/lab";
import useCheckin from "../hooks/useCheckin";
import { ApiError } from "../../../api/generated";
import { useAlert } from "react-alert";

const EventParamsSchema = z.object({
  eventId: z.string(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const initialAuthStatus = await ensureAuth();

  const { eventId } = EventParamsSchema.parse(params);
  const initialEventData = await queryClient.ensureQueryData(
    eventApi.getEvent(eventId),
  );

  return {
    initialAuthStatus,
    initialEventData,
  };
}

const EventCheckinSchema = z.object({
  /**
   * Alphanumeric code that is displayed at the event. a-z, A-Z, 0-9
   */
  eventCode: z
    .string()
    .length(8, {
      message: "Event code must be 8 characters long",
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Event code must be alphanumeric",
    }),
});

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useZodForm({
    schema: EventCheckinSchema,
    defaultValues: {
      eventCode: "",
    },
  });

  const checkinMutation = useCheckin();

  const navigate = useNavigate();
  const alert = useAlert();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await checkinMutation.mutateAsync({
        code: data.eventCode,
        eventId: loaderData.initialEventData.id,
      });

      alert.success("Successfully checked in!", { timeout: 2000 });

      navigate(`/`);
    } catch (e) {
      if (e instanceof ApiError) {
        setError("eventCode", {
          message: e.body.message,
        });
      }
    }
  });

  return (
    <Container
      sx={{
        my: 2,
        overflow: "auto",
      }}
    >
      <Stack gap={2}>
        <Paper sx={{ p: 2 }} component={"form"} onSubmit={onSubmit}>
          <Stack gap={2}>
            <Typography variant="h4" textAlign={"center"}>
              Event Check In
            </Typography>
            <Typography variant="body1" textAlign={"center"}>
              Check in for the event using the code displayed at the event by
              entering it below. Or, use your phone's camera to scan the QR
              code.
            </Typography>
            <TextField
              label="Event Code"
              variant="outlined"
              fullWidth
              {...register("eventCode", { required: true })}
              error={!!errors.eventCode}
              helperText={errors.eventCode?.message}
              required
            />
            <LoadingButton
              variant="contained"
              color="primary"
              type="submit"
              loading={isSubmitting}
            >
              Check In
            </LoadingButton>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
