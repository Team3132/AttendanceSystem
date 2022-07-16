import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Container,
  Divider,
  Heading,
  Spinner,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Tag,
  Text,
} from "@chakra-ui/react";
import { AttendedList, RSVPList } from "@components";
import { useEvent } from "@hooks";
import { DateTime } from "luxon";
import { useParams } from "react-router-dom";

export const EventDetailsScreen: React.FC = () => {
  const { eventId } = useParams();
  const { event, isLoading, isError, mutate } = useEvent(eventId);

  return (
    <>
      {isLoading || !event ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Container maxW="container.md">
          <Stack spacing={5} divider={<Divider />}>
            <Heading textAlign={"center"} mt={6}>
              {event?.title}
              <br />
              {event?.allDay ? (
                <Tag colorScheme={"blue"} size="md">
                  All Day
                </Tag>
              ) : null}
            </Heading>
            <StatGroup textAlign={"center"}>
              <Stat>
                <StatLabel>Start DateTime</StatLabel>
                <StatNumber>
                  {DateTime.fromISO(event.startDate).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </StatNumber>
              </Stat>

              <Stat>
                <StatLabel>End DateTime</StatLabel>
                <StatNumber>
                  {DateTime.fromISO(event.endDate).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </StatNumber>
              </Stat>
            </StatGroup>

            <Stack textAlign={"center"}>
              <Heading size="md">Description</Heading>
              <Text>
                {event.description.length > 0
                  ? event.description
                  : "No description"}
              </Text>
            </Stack>
            <Accordion allowMultiple>
              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          RSVPs
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {isExpanded ? <RSVPList eventId={event?.id} /> : null}
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          Attendance
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {isExpanded ? <AttendedList eventId={event?.id} /> : null}
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            </Accordion>
            {/* <RSVPButtonRow eventId={event?.id} /> */}
            {/* <AttendanceButtonRow eventId={event?.id} /> */}
            {/* <RSVPList eventId={event?.id} /> */}
          </Stack>
        </Container>
      )}
    </>
  );
};

export default EventDetailsScreen;
