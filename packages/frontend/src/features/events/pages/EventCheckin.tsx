import { Container, Paper, Stack, Typography } from "@mui/material";
import useZodForm from "../../../hooks/useZodForm";
import { LoadingButton } from "@mui/lab";
import useSelfCheckin from "../hooks/useSelfCheckin";
import { useAlert } from "react-alert";
import { isTRPCClientError } from "@/utils/trpc";
import { SelfCheckinSchema } from "backend/schema";
import ControlledTextField from "@/components/ControlledTextField";
import { RouteApi } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

const apiRoute = new RouteApi({
  id: "/authedOnly/events/$eventId/check-in",
});

export function Component() {
  const loaderData = apiRoute.useLoaderData();
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useZodForm({
    schema: SelfCheckinSchema,
    defaultValues: {
      secret: "",
      eventId: loaderData.initialEvent.id,
    },
  });

  const checkinMutation = useSelfCheckin();

  const navigate = useNavigate();
  const alert = useAlert();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await checkinMutation.mutateAsync({
        secret: data.secret,
        eventId: loaderData.initialEvent.id,
      });

      alert.success("Successfully checked in!", { timeout: 2000 });

      navigate({
        to: "",
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
