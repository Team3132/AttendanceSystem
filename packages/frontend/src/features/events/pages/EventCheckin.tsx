import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { z } from "zod";
import ensureAuth from "../../auth/utils/ensureAuth";
import { Container, Paper, Stack, Typography } from "@mui/material";
import useZodForm from "../../../hooks/useZodForm";
import { LoadingButton } from "@mui/lab";
import useSelfCheckin from "../hooks/useSelfCheckin";
import { useAlert } from "react-alert";
import { isTRPCClientError } from "@/utils/trpc";
import { SelfCheckinSchema } from "@team3132/attendance-backend/schema";
import ControlledTextField from "@/components/ControlledTextField";
import { queryUtils } from "@/trpcClient";

const EventParamsSchema = z.object({
  eventId: z.string(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const initialAuthStatus = await ensureAuth();

  const { eventId } = EventParamsSchema.parse(params);

  const initialEventData = await queryUtils.events.getEvent.ensureData(eventId);

  return {
    initialAuthStatus,
    initialEventData,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useZodForm({
    schema: SelfCheckinSchema,
    defaultValues: {
      secret: "",
      eventId: loaderData.initialEventData.id,
    },
  });

  const checkinMutation = useSelfCheckin();

  const navigate = useNavigate();
  const alert = useAlert();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await checkinMutation.mutateAsync({
        secret: data.secret,
        eventId: loaderData.initialEventData.id,
      });

      alert.success("Successfully checked in!", { timeout: 2000 });

      navigate(`/`);
    } catch (e) {
      if (isTRPCClientError(e)) {
        alert.error(e.message, { timeout: 2000 });
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
            <ControlledTextField
              label="Event Code"
              variant="outlined"
              fullWidth
              name="secret"
              control={control}
              rules={{ required: "This field is required" }}
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
