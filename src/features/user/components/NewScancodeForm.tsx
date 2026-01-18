import ControlledTextField from "@/components/ControlledTextField";
import { isServerError } from "@/server/utils/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ListItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useCreateSelfScancode from "../hooks/useCreateSelfScancode";

const NewScancodeSchema = z.object({
  code: z
    .string()
    .min(6)
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Event code must be alphanumeric",
    }),
});

export default function NewScancodeListItem() {
  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
    reset,
    control,
  } = useForm({
    resolver: zodResolver(NewScancodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const createSelfScancodeMutation = useCreateSelfScancode();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createSelfScancodeMutation.mutateAsync({ data: data.code });

      reset({
        code: "",
      });
    } catch (error) {
      if (isServerError(error)) {
        setError("code", {
          message: error.message,
        });
      }
    }
  });

  return (
    <ListItem component={"form"} onSubmit={onSubmit}>
      <ControlledTextField
        required
        label={"New Scancode"}
        control={control}
        name={"code"}
        rules={{
          required: "Event code is required",
        }}
      />
      <Button
        loading={isSubmitting}
        type={"submit"}
        variant="contained"
        size="large"
      >
        Create
      </Button>
    </ListItem>
  );
}
