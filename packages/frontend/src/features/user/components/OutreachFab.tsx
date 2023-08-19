import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userApi, { userKeys } from "../../../api/query/user.api";
import { z } from "zod";
import { useEffect } from "react";
import useZodForm from "../../../hooks/useZodForm";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  TextField,
} from "@mui/material";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { FaPlus } from "react-icons/fa6";
import { ApiError } from "../../../api/generated";

interface OutreachFabProps {
  userId: string;
}

const OutreachFabSchema = z.object({
  hours: z.coerce.number(),
});

export default function OutreachFab(props: OutreachFabProps) {
  const { getButtonProps, getDisclosureProps, onClose, isOpen } =
    useDisclosure();

  const { userId } = props;

  const additionalOutreachHoursQuery = useQuery({
    ...userApi.getAdditionalOutreachHours(userId),
    enabled: isOpen,
  });

  const queryClient = useQueryClient();

  const editAdditionalOutreachHoursMutation = useMutation({
    ...userApi.editAdditionalOutreach,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.additionalOutreachHours(variables.userId),
      });
    },
  });

  const { register, formState, handleSubmit, setError, reset } = useZodForm({
    schema: OutreachFabSchema,
  });

  useEffect(() => {
    if (additionalOutreachHoursQuery.data !== undefined) {
      reset(OutreachFabSchema.parse(additionalOutreachHoursQuery.data));
    }
  }, [additionalOutreachHoursQuery.data, reset]);

  const onSubmit = async (data: z.infer<typeof OutreachFabSchema>) => {
    try {
      await editAdditionalOutreachHoursMutation.mutateAsync({
        userId,
        hours: data.hours,
      });
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setError("hours", error.body.message);
      }
    }
  };

  return (
    <>
      <Fab
        variant="extended"
        color="primary"
        {...getButtonProps()}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
      >
        <FaPlus />
      </Fab>
      <Dialog {...getDisclosureProps()}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Additional Outreach Hours</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the number of additional outreach hours for this user. This
              is added to the hours from events that they have attended.
            </DialogContentText>
            <TextField
              autoFocus
              {...register("hours", {
                valueAsNumber: true,
              })}
              error={!!formState.errors.hours}
              helperText={formState.errors.hours?.message}
              label="Hours"
              type="number"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                onClose();
                if (additionalOutreachHoursQuery.data) {
                  reset(
                    OutreachFabSchema.parse(additionalOutreachHoursQuery.data),
                  );
                }
              }}
            >
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
