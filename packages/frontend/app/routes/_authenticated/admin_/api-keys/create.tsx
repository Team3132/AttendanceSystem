import ControlledTextField from "@/components/ControlledTextField";
import DefaultAppBar from "@/components/DefaultAppBar";
import useCreateKey from "@/features/admin/hooks/useCreateKey";
import useZodForm from "@/hooks/useZodForm";
import { Button, Container } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/admin_/api-keys/create")({
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
    await createApiKeyMutation.mutateAsync({ data: data.name });
    navigate({
      to: "/admin/api-keys",
    });
  });

  return (
    <>
      <DefaultAppBar title="Admin - Create API Key" />
      <Container
        sx={{
          my: 2,
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        component={"form"}
        onSubmit={onSubmit}
      >
        <ControlledTextField
          control={control}
          name="name"
          label="Name"
          helperText="A name for the API key."
        />
        <Button type={"submit"} loading={isSubmitting}>
          Create API Key
        </Button>
      </Container>
    </>
  );
}
