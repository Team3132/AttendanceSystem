import ControlledAutocomplete from "@/components/ControlledAutocomplete";
import ControlledTextField from "@/components/ControlledTextField";
import DefaultAppBar from "@/components/DefaultAppBar";
import useCreateRule from "@/features/admin/hooks/useCreateRule";
import useZodForm from "@/hooks/useZodForm";
import { discordQueryOptions } from "@/queries/discord.queries";
import { LoadingButton } from "@mui/lab";
import { Container } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import cron from "cron-validate";
import { useMemo } from "react";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authenticated/admin_/event-parsing/create",
)({
  component: RouteComponent,
});

const OptionSchema = z.object({
  label: z.string().nonempty(),
  value: z.string().nonempty(),
});

const NewEventParsingRuleFormSchema = z.object({
  channel: OptionSchema.nullable(),
  name: z.string().min(1),
  regex: z
    .string()
    .min(3)
    .refine((v) => {
      try {
        new RegExp(v);
        return true;
      } catch {
        return false;
      }
    }),
  roles: z.array(OptionSchema).min(1),
  cronExpr: z.string().refine((v) => cron(v).isValid(), {
    message: "Invalid cron expression",
  }),
});

function RouteComponent() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useZodForm({
    schema: NewEventParsingRuleFormSchema,
    defaultValues: {
      channel: null,
      cronExpr: "",
      name: "",
      regex: "",
      roles: [],
    },
  });

  const createRuleMutation = useCreateRule();

  const onSubmit = handleSubmit(async (data) =>
    createRuleMutation.mutateAsync({
      data: {
        ...data,
        channelId: data.channel?.value as string,
        roleIds: data.roles.map((r) => r.value),
      },
    }),
  );

  const channelsQuery = useSuspenseQuery(discordQueryOptions.serverChannels());

  const channelOptions = useMemo(
    () =>
      channelsQuery.data.map((c) => ({
        label: `#${c.name}`,
        value: c.id,
      })),
    [channelsQuery.data],
  );

  const rolesQuery = useSuspenseQuery(discordQueryOptions.serverRoles());

  const roleOptions = useMemo(
    () =>
      rolesQuery.data.map((c) => ({
        label: c.name,
        value: c.id,
      })),
    [rolesQuery.data],
  );

  return (
    <>
      <DefaultAppBar title="Admin - Event Parsing" />
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
        <ControlledTextField control={control} name="name" label="Name" />
        <ControlledTextField control={control} name="regex" label="Regex" />
        <ControlledTextField
          control={control}
          name="cronExpr"
          label="Cron Expression"
        />
        <ControlledAutocomplete
          control={control}
          name="channel"
          label="Channel"
          options={channelOptions}
        />
        <ControlledAutocomplete
          control={control}
          name="roles"
          label="Roles"
          options={roleOptions}
          multiple
        />
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={isSubmitting}
        >
          Submit
        </LoadingButton>
      </Container>
    </>
  );
}
