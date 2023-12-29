import { Paper, Stack, TextField, Typography } from "@mui/material";
import { z } from "zod";
import useZodForm from "../../../hooks/useZodForm";
import { LoadingButton } from "@mui/lab";
import useScanin from "../hooks/useScanin";
import { useAlert } from "react-alert";
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
  const { getDisclosureProps } = useDisclosure();

  const {
    register,
    setFocus,
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
        scancode: data.code,
      });
      reset({
        code: "",
      });
      alert.success("Scan in successful", {
        timeout: 2000,
      });
      setUnknownCode(undefined);
      setFocus("code");
    } catch (error) {
      setUnknownCode(data.code);
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
            error={!!errors.code || scanInMutation.isError}
            helperText={errors.code?.message ?? scanInMutation.error?.message}
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
