import DefaultAppBar from "@/components/DefaultAppBar";
import { adminQueries } from "@/queries/adminQueries";
import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin_/event-parsing")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(adminQueries.eventParsingRules);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const parsingRulesQuery = useSuspenseQuery(adminQueries.eventParsingRules);

  return (
    <>
      <DefaultAppBar title="Admin - Event Parsing" />
      <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
        <List>
          {parsingRulesQuery.data.map((rule) => (
            <ListItem disablePadding key={rule.id}>
              <ListItemButton>
                <ListItemText primary={rule.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
}
