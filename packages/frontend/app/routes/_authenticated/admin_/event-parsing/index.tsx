import DefaultAppBar from "@/components/DefaultAppBar";
import useDeleteRule from "@/features/admin/hooks/useDeleteRule";
import useDuplicateRule from "@/features/admin/hooks/useDuplicateRule";
import { adminQueries } from "@/queries/adminQueries";
import { Container, IconButton, List, ListItem, Stack } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FaCopy, FaTrash } from "react-icons/fa6";

export const Route = createFileRoute("/_authenticated/admin_/event-parsing/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(adminQueries.eventParsingRules);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const parsingRulesQuery = useSuspenseQuery(adminQueries.eventParsingRules);

  const duplicateRuleMutation = useDuplicateRule();
  const deleteRuleMutation = useDeleteRule();

  const handleDuplicateRule = (id: string) =>
    duplicateRuleMutation.mutate({ data: id });

  const handleDeleteRule = (id: string) =>
    deleteRuleMutation.mutate({ data: id });

  return (
    <>
      <DefaultAppBar title="Admin - Event Parsing" />
      <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
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
                </Stack>
              }
            >
              {rule.kronosRule.title}
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
}
