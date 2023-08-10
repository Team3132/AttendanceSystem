import { Paper, Stack, TextField, Typography } from "@mui/material";
import { z } from "zod";
import useZodForm from "../../../hooks/useZodForm";
import { LoadingButton } from "@mui/lab";
import useScanin from "../hooks/useScanin";
import { useAlert } from "react-alert";
import { ApiError } from "../../../api/generated";
import { useState } from "react";
import UnknownCodeModal from "./UnknownCodeModal";
import { useDisclosure } from "../../../hooks/useDisclosure";

interface ScaninCardProps {
  eventId: string;
}

const ScaninSchema = z.object({
  code: z
    .string()
    .nonempty()
    .regex(/^[a-zA-Z0-9]+$/),
});

export default function ScaninCard(props: ScaninCardProps) {
  const { eventId } = props;
  const alert = useAlert();
  const [unknownCode, setUnknownCode] = useState<string | undefined>(undefined);
  const { getDisclosureProps, onOpen } = useDisclosure();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useZodForm({
    schema: ScaninSchema,
    defaultValues: {
      code: "",
    },
  });

  const scanInMutation = useScanin();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await scanInMutation.mutateAsync({
        eventId,
        code: data.code,
      });
      reset({
        code: "",
      });
      alert.success("Scan in successful", {
        timeout: 2000,
      });
      setUnknownCode(undefined);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 404) {
          // TODO: Prompt to add a new scancode
          alert.info("Scan code not found", {
            timeout: 2000,
          });
          setUnknownCode(data.code);
          reset({
            code: "",
          });
          onOpen();
        } else {
          alert.error(error.body.message, {
            timeout: 2000,
          });
          setUnknownCode(undefined);
          reset({
            code: "",
          });
        }
      } else {
        alert.error("An unknown error occurred", {
          timeout: 2000,
        });
        setUnknownCode(undefined);
        reset({
          code: "",
        });
      }
    }
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Stack gap={2} component={"form"} onSubmit={onSubmit}>
        <Typography variant="h5" textAlign={"center"}>
          Scan In
        </Typography>
        <Stack
          gap={2}
          sx={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TextField
            {...register("code")}
            label="Scan In Code"
            variant="outlined"
            disabled={isSubmitting}
            error={!!errors.code}
            helperText={errors.code?.message}
            autoFocus
          />
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
          >
            Scan In
          </LoadingButton>
        </Stack>
      </Stack>
      {unknownCode ? (
        <UnknownCodeModal
          code={unknownCode}
          eventId={eventId}
          {...getDisclosureProps()}
        />
      ) : null}
    </Paper>
  );
}
