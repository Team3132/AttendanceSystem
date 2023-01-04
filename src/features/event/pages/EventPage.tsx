import { useAuthStatus } from "@/features/auth";
import { RSVPStatus } from "@/features/rsvp";
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
import AdminCheckin from "../components/AdminCheckin";
import EventDetails from "../components/EventDetails";
import UserCheckin from "../components/UserCheckin";
import useEvent from "../hooks/useEvent";

export default function EventPage() {
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
          <Tab>User Check-in</Tab>
          <Tab>Event Check-in</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Container maxW="container.md">
              <EventDetails event={event.data} />
            </Container>
          </TabPanel>
          <TabPanel>
            <Container maxW="container.md">
              <RSVPStatus event={event.data} />
            </Container>
          </TabPanel>
          <TabPanel>
            <Container maxW="container.md">
              {/* User Checkin, i.e entering event code */}
              <UserCheckin event={event.data} />
            </Container>
          </TabPanel>
          <TabPanel>
            <Container maxW="container.md">
              {auth.isAdmin ? <AdminCheckin event={event.data} /> : null}{" "}
              {/** Used to display checkin qr and code entering */}
            </Container>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
