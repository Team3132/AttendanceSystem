import ControlledTextField from "@/components/ControlledTextField";
import { isServerError } from "@/server/utils/errors";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useState } from "react";
import { z } from "zod";
import { useDisclosure } from "../../../hooks/useDisclosure";
import useZodForm, { type ZodSubmitHandler } from "../../../hooks/useZodForm";
import useScanin from "../hooks/useScanin";
import UnknownCodeModal from "./UnknownCodeModal";

interface ScaninCardProps {
  eventId: string;
}

const ScaninSchema = z.object({
  code: z
    .string()
    .nonempty()
    .regex(/^[a-zA-Z0-9]+$/),
});

const PaddedPaper = styled(Paper)({
  padding: 2,
});

export default function ScaninCard(props: ScaninCardProps) {
  const { eventId } = props;
  const [unknownCode, setUnknownCode] = useState<string | undefined>(undefined);
  const { getDisclosureProps, onOpen } = useDisclosure();

  const {
    setFocus,
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useZodForm({
    schema: ScaninSchema,
    defaultValues: {
      code: "",
    },
  });

  const scanInMutation = useScanin();

  const onSubmit: ZodSubmitHandler<typeof ScaninSchema> = useCallback(
    async (data) => {
      try {
        await scanInMutation.mutateAsync({
          data: { eventId, scancode: data.code },
        });
        reset({
          code: "",
        });

        setUnknownCode(undefined);
        setFocus("code");
      } catch (error) {
        if (isServerError(error) && error.code === "NOT_FOUND") {
          setUnknownCode(data.code);
          onOpen();
        }
      }
    },
    [eventId, onOpen, reset, scanInMutation, setFocus],
  );

  const codeCreatedCallback = useCallback(
    (createdCode: string) => {
      onSubmit({
        code: createdCode,
      });
    },
    [onSubmit],
  );

  return (
    <PaddedPaper>
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
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
          <ControlledTextField
            control={control}
            name="code"
            label="Code"
            helperText={"Enter a code to scan in"}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
          >
            Scan In
          </Button>
        </Stack>
      </Stack>
      {unknownCode ? (
        <UnknownCodeModal
          code={unknownCode}
          {...getDisclosureProps()}
          successCallback={codeCreatedCallback}
        />
      ) : null}
    </PaddedPaper>
  );
}
