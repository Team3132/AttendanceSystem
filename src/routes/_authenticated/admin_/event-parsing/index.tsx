import { LinkIconButton } from "@/components/LinkIconButton";
import useDeleteRule from "@/features/admin/hooks/useDeleteRule";
import useDeployCommands from "@/features/admin/hooks/useDeployCommands";
import useSyncCalendar from "@/features/admin/hooks/useSyncCalendar";
import useSyncCalendarFull from "@/features/admin/hooks/useSyncCalendarFull";
import useTriggerRule from "@/features/admin/hooks/useTriggerRule";
import { adminQueries } from "@/queries/adminQueries";
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
  const navigate = Route.useNavigate();

  const deleteRuleMutation = useDeleteRule();
  const triggerRuleMutation = useTriggerRule();

  const handleDuplicateRule = useCallback(
    (id: string) => {
      const rule = parsingRulesQuery.data.find((r) => r.id === id);

      if (!rule) return;

      navigate({
        to: "/admin/event-parsing/create",
        search: {
          name: `${rule.name} (Copy)`,
          regex: rule.regex,
          roleIds: rule.roleIds,
          cronExpr: rule.cronExpr,
          channelId: rule.channelId,
          priority: rule.priority,
          isOutreach: rule.isOutreach,
        },
      });
    },
    [navigate, parsingRulesQuery.data],
  );

  const handleDeleteRule = useCallback(
    (id: string) => deleteRuleMutation.mutate({ data: id }),
    [deleteRuleMutation.mutate],
  );

  const handleTriggerRule = useCallback(
    (id: string) => triggerRuleMutation.mutate({ data: id }),
    [triggerRuleMutation.mutate],
  );

  return (
    <>
      <List>
        {parsingRulesQuery.data.map((rule) => (
          <ListItem
            disablePadding
            key={rule.id}
            secondaryAction={
              <Stack direction={"row"} gap={2}>
                <IconButton onClick={() => handleDeleteRule(rule.id)}>
                  <FaTrash />
                </IconButton>
                <IconButton onClick={() => handleDuplicateRule(rule.id)}>
                  <FaCopy />
                </IconButton>
                <IconButton
                  onClick={() => handleTriggerRule(rule.id)}
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
            <ListItemText primary={rule.name} secondary={rule.priority} />
          </ListItem>
        ))}
      </List>
      <Stack direction={"row"} gap={2}>
        <SyncEventsButton />
        <SyncEventsFullButton />
        <DeployDiscordCommandsButton />
      </Stack>
    </>
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

function SyncEventsFullButton() {
  const syncEventsFullMutation = useSyncCalendarFull();
  const syncEventsFull = () => syncEventsFullMutation.mutate();

  return (
    <Button
      onClick={syncEventsFull}
      loading={syncEventsFullMutation.isPending}
      variant="contained"
      color="warning"
    >
      Sync Events Full
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
