import ControlledTextField from "@/components/ControlledTextField";
import useCreateKey from "@/features/admin/hooks/useCreateKey";
import useZodForm from "@/hooks/useZodForm";
import { Button, Stack } from "@mui/material";
import {} from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute({
  head: () => ({
    meta: [
      {
        title: "Admin - Create API Key",
      },
    ],
  }),
  component: RouteComponent,
});

const NewApiKeyFormSchema = z.object({
  name: z.string().nonempty(),
});

function RouteComponent() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useZodForm({
    schema: NewApiKeyFormSchema,
    defaultValues: {
      name: "",
    },
  });

  const createApiKeyMutation = useCreateKey();

  const navigate = Route.useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const result = await createApiKeyMutation.mutateAsync({ data: data.name });

    prompt("API Key", result.id);

    navigate({
      to: "/admin/api-keys",
    });
  });

  return (
    <Stack gap={2} component={"form"} onSubmit={onSubmit}>
      <ControlledTextField
        control={control}
        name="name"
        label="Name"
        helperText="A name for the API key."
      />
      <Button type={"submit"} loading={isSubmitting}>
        Create API Key
      </Button>
    </Stack>
  );
}
