import ControlledAutocomplete from "@/components/ControlledAutocomplete";
import ControlledCheckbox from "@/components/ControlledCheckbox";
import ControlledTextField from "@/components/ControlledTextField";
import useUpdateRule from "@/features/admin/hooks/useUpdateRule";
import useZodForm from "@/hooks/useZodForm";
import { adminQueries } from "@/queries/adminQueries";
import { discordQueryOptions } from "@/queries/discord.queries";
import { strToRegex } from "@/server/utils/regexBuilder";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authenticated/admin_/event-parsing/$ruleId",
)({
  head: () => ({
    meta: [
      {
        title: "Admin - Edit Rule",
      },
    ],
  }),
  loader: ({ context: { queryClient }, params: { ruleId } }) => {
    queryClient.prefetchQuery(adminQueries.eventParsingRule(ruleId));
  },
  component: RouteComponent,
});

const OptionSchema = z.object({
  label: z.string().nonempty(),
  value: z.string().nonempty(),
});

const NewEventParsingRuleFormSchema = z.object({
  channel: OptionSchema.nullable(),
  priority: z.coerce.number().int().min(0).max(100),
  regex: z
    .string()
    .min(3)
    .refine((v) => {
      try {
        strToRegex(v);
        return true;
      } catch {
        return false;
      }
    }),
  roles: z.array(OptionSchema).min(1),
  isOutreach: z.boolean(),
});

function RouteComponent() {
  const { ruleId } = Route.useParams();

  const parsingRuleQuery = useSuspenseQuery(
    adminQueries.eventParsingRule(ruleId),
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

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useZodForm({
    schema: NewEventParsingRuleFormSchema,
    defaultValues: {
      priority: parsingRuleQuery.data?.priority,
      channel: channelOptions.find(
        (c) => c.value === parsingRuleQuery.data?.channelId,
      ),
      regex: parsingRuleQuery.data?.regex,
      roles: roleOptions.filter((r) =>
        parsingRuleQuery.data?.roleIds.includes(r.value),
      ),
      isOutreach: parsingRuleQuery.data?.isOutreach,
    },
  });

  const updateRuleMutation = useUpdateRule();

  const onSubmit = handleSubmit(async (data) =>
    updateRuleMutation.mutateAsync({
      data: {
        ...data,
        id: ruleId,
        channelId: data.channel?.value as string,
        roleIds: data.roles.map((r) => r.value),
      },
    }),
  );

  return (
    <Stack gap={2} component="form" onSubmit={onSubmit}>
      <Typography variant="h4">Edit Rule</Typography>

      <TextField
        value={parsingRuleQuery.data?.kronosRule.title}
        label="Name"
        disabled
      />
      <ControlledTextField control={control} name="regex" label="Regex" />
      <TextField
        disabled
        value={parsingRuleQuery.data?.kronosRule.cronExpr}
        label="Cron Expression"
        helperText="Create a new rule to change this"
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
      <ControlledTextField
        control={control}
        name="priority"
        label="Priority"
        type="number"
        helperText="The higher the number, the higher the priority"
      />
      <ControlledCheckbox
        control={control}
        name="isOutreach"
        label="Counts for Outreach?"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        loading={isSubmitting}
      >
        Save
      </Button>
    </Stack>
  );
}
