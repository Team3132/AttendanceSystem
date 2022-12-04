import { RSVPList } from "@/components";
import { useAuthStatus, useEvent } from "@/hooks";
import {
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import EventCheckin from "./EventCheckIn";
import EventDetails from "./EventDetails";

export default function Event() {
  const { eventId } = useParams();
  const event = useEvent(eventId);
  const auth = useAuthStatus();

  if (!event.isSuccess) {
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
          <Tab isDisabled={!auth?.isAdmin}>Check-in</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <EventDetails event={event.data} />
          </TabPanel>
          <TabPanel>
            <RSVPList eventId={event.data.id} />
          </TabPanel>
          <TabPanel>
            <EventCheckin event={event.data} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
