import { trpc } from "@/trpcClient";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { DateTime } from "luxon";

export default function UpcomingEventsPage() {
  const upcomingEventsQuery = trpc.events.getUpcomingEventsWithSecret.useQuery(
    {
      leeway: 30,
    },
    {
      // refresh every minute
      refetchInterval: 60 * 1000,
    },
  );

  return (
    <Container>
      <Typography variant="h4">Upcoming Events</Typography>
      <Typography variant="body1" paragraph gutterBottom>
        Events that are starting within the next 30 minutes. Use the event code
        on the right to check in on discord via the <code>/checkin</code>{" "}
        command or by clicking checkin
      </Typography>
      <List>
        {upcomingEventsQuery.data?.map((secretEvent) => {
          const startTimeText = DateTime.fromMillis(
            Date.parse(secretEvent.startDate),
          ).toLocaleString(DateTime.TIME_SIMPLE);

          const endTimeText = DateTime.fromMillis(
            Date.parse(secretEvent.endDate),
          ).toLocaleString(DateTime.TIME_SIMPLE);

          return (
            <ListItem key={secretEvent.id}>
              <ListItemText
                primary={secretEvent.title}
                secondary={`${startTimeText} - ${endTimeText}`}
              />
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
}
