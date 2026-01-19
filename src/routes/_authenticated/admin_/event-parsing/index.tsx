import { LinkButton } from "@/components/LinkButton";
import { LinkIconButton } from "@/components/LinkIconButton";
import useDeleteRule from "@/features/admin/hooks/useDeleteRule";
import useDeployCommands from "@/features/admin/hooks/useDeployCommands";
import useSyncCalendar from "@/features/admin/hooks/useSyncCalendar";
import useTriggerRule from "@/features/admin/hooks/useTriggerRule";
import { adminQueries } from "@/queries/adminQueries";
import type { ParsingRule } from "@/server/drizzle/schema";
import { getLocale } from "@/utils/dt";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DateTime } from "luxon";

import { useCallback } from "react";
import { FaCopy, FaPen, FaPlay, FaTrash } from "react-icons/fa6";

export const Route = createFileRoute("/_authenticated/admin_/event-parsing/")({
  head: () => ({
    meta: [
      {
        title: "Admin - Event Parsing",
      },
    ],
  }),
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(adminQueries.eventParsingRules);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const parsingRulesQuery = useSuspenseQuery(adminQueries.eventParsingRules);

  return (
    <>
      <List>
        {parsingRulesQuery.data.map((rule) => (
          <ParsingRuleListItem key={rule.id} rule={rule} />
        ))}
      </List>
      <Stack direction={"row"} gap={2}>
        <SyncEventsButton />
        <DeployDiscordCommandsButton />
        <LinkButton to="/admin/event-parsing/create">Create Rule</LinkButton>
      </Stack>
    </>
  );
}

function ParsingRuleListItem(props: { rule: ParsingRule }) {
  const { rule } = props;

  const deleteRuleMutation = useDeleteRule();
  const triggerRuleMutation = useTriggerRule();

  const handleDeleteRule = useCallback(
    () => deleteRuleMutation.mutate({ data: rule.id }),
    [deleteRuleMutation.mutate, rule.id],
  );

  const handleTriggerRule = useCallback(
    () => triggerRuleMutation.mutate({ data: rule.id }),
    [triggerRuleMutation.mutate, rule.id],
  );

  return (
    <ListItem
      disablePadding
      key={rule.id}
      secondaryAction={
        <Stack direction={"row"} gap={2}>
          <IconButton onClick={handleDeleteRule}>
            <FaTrash />
          </IconButton>
          <LinkIconButton
            to="/admin/event-parsing/create"
            params={{
              name: `${rule.name} (Copy)`,
              regex: rule.regex,
              roleIds: rule.roleIds,
              cronExpr: rule.cronExpr,
              channelId: rule.channelId,
              priority: rule.priority,
              isOutreach: rule.isOutreach,
            }}
          >
            <FaCopy />
          </LinkIconButton>
          <IconButton
            onClick={handleTriggerRule}
            disabled={triggerRuleMutation.isPending}
          >
            <FaPlay />
          </IconButton>
          <LinkIconButton
            to="/admin/event-parsing/$ruleId"
            params={{
              ruleId: rule.id,
            }}
          >
            <FaPen />
          </LinkIconButton>
        </Stack>
      }
    >
      <ListItemText
        primary={rule.name}
        secondary={`Priority: ${rule.priority}, Last Run: ${rule.lastRun === null ? "Never" : DateTime.fromJSDate(rule.lastRun).toLocaleString(DateTime.DATETIME_MED, { locale: getLocale() })}`}
      />
    </ListItem>
  );
}

function SyncEventsButton() {
  const syncEventsMutation = useSyncCalendar();
  const syncEvents = () => syncEventsMutation.mutate();

  return (
    <Button
      onClick={syncEvents}
      loading={syncEventsMutation.isPending}
      variant="contained"
    >
      Sync Events
    </Button>
  );
}

function DeployDiscordCommandsButton() {
  const deployCommandsMutation = useDeployCommands();
  const deployCommands = () => deployCommandsMutation.mutate({});

  return (
    <Button
      onClick={deployCommands}
      loading={deployCommandsMutation.isPending}
      variant="contained"
      color="secondary"
    >
      Deploy Discord Commands
    </Button>
  );
}
