import { z } from "zod";
import useZodForm from "../../../hooks/useZodForm";
import { ListItem, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useCreateScancode from "../hooks/useCreateScancode";
import { ApiError } from "../../../api/generated";

const NewScancodeSchema = z.object({
  code: z
    .string()
    .nonempty({
      message: "Event code cannot be empty",
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Event code must be alphanumeric",
    })

    .min(6),
});

interface NewScancodeListItemProps {
  userId?: string;
}

export default function NewScancodeListItem(props: NewScancodeListItemProps) {
  const { userId } = props;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useZodForm({
    schema: NewScancodeSchema,
    defaultValues: {
      code: "",
    },
  });

  const createScancodeMutation = useCreateScancode();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createScancodeMutation.mutateAsync({
        code: data.code,
        userId,
      });
      reset({
        code: "",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setError("code", {
          message: error.body.message,
        });
      }
    }
  });

  return (
    <ListItem component={"form"} onSubmit={onSubmit}>
      <TextField
        required
        label={"New Scancode"}
        {...register("code", {
          required: "Event code cannot be empty",
        })}
        fullWidth
        error={!!errors.code}
        helperText={errors.code?.message}
      />
      <LoadingButton
        loading={isSubmitting}
        type={"submit"}
        variant="contained"
        size="large"
        sx={{
          ml: 2,
        }}
      >
        Create
      </LoadingButton>
    </ListItem>
  );
}
