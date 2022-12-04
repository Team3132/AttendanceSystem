import { RSVPList } from "@/components";
import { useAuthStatus, useEvent } from "@/hooks";
import {
  Container,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import AdminCheckin from "./AdminCheckin";
import EventDetails from "./EventDetails";

export default function Event() {
  const { eventId } = useParams();
  const event = useEvent(eventId);
  const auth = useAuthStatus();

  if (!event.isSuccess || !auth.isSuccess) {
    return <Spinner />;
  }

  return (
    <>
      <Heading textAlign={"center"} my={6}>
        {event.data.title}
      </Heading>
      <Tabs isLazy>
        <TabList justifyContent={"center"}>
          <Tab>Details</Tab>
          <Tab>Attendance</Tab>
          <Tab>Check-in</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Container maxW="container.md">
              <EventDetails event={event.data} />
            </Container>
          </TabPanel>
          <TabPanel>
            <Container maxW="container.md">
              <RSVPList eventId={event.data.id} />
            </Container>
          </TabPanel>
          <TabPanel>
            <Container maxW="container.md">
              {auth.isAdmin ? <AdminCheckin event={event.data} /> : null}
            </Container>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
