import ControlledTextField from "@/components/ControlledTextField";
import useSelfCheckin from "@/features/events/hooks/useSelfCheckin";
import useZodForm from "@/hooks/useZodForm";
import { eventQueryOptions } from "@/queries/events.queries";
import { isTRPCClientError } from "@/utils/trpc";
import { LoadingButton } from "@mui/lab";
import { Container, Stack, Paper, Typography } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SelfCheckinSchema } from "@/api/schema";
import { useAlert } from "react-alert";

export const Route = createFileRoute(
  "/_authenticated/events_/$eventId/check-in",
)({
  component: Component,
  loader: async ({ context: { queryClient }, params: { eventId } }) =>
    queryClient.ensureQueryData(eventQueryOptions.eventDetails(eventId)),
});

function Component() {
  const loaderData = Route.useLoaderData();
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useZodForm({
    schema: SelfCheckinSchema,
    defaultValues: {
      secret: "",
      eventId: loaderData.id,
    },
  });

  const checkinMutation = useSelfCheckin();

  const navigate = useNavigate();
  const alert = useAlert();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await checkinMutation.mutateAsync({
        secret: data.secret,
        eventId: loaderData.id,
      });

      alert.success("Successfully checked in!", { timeout: 2000 });

      navigate({
        to: "/",
      });
    } catch (e) {
      if (isTRPCClientError(e)) {
        alert.error(e.message, { timeout: 2000 });
      }
    }
  });

  return (
    <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
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
