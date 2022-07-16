import { RSVPSelect, StatusForRangeButton } from "@/components";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  LinkBox,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEvents } from "@hooks";
import { DateTime } from "luxon";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Agenda: React.FC = () => {
  const [startRange, setStartRange] = useState<DateTime>(DateTime.now());
  const [endRange, setEndRange] = useState<DateTime>(
    DateTime.now().plus({ days: 7 })
  );

  const { events, isLoading } = useEvents(
    undefined,
    startRange?.toJSDate(),
    endRange?.toJSDate()
  );

  return (
    <>
      <Heading textAlign={"center"} mt={6}>
        Agenda
      </Heading>
      <Divider my={6} />
      <Container maxW="container.sm">
        <Flex>
          <FormControl maxW={"10em"}>
            <FormLabel htmlFor="startDate" textAlign={"center"}>
              Start
            </FormLabel>
            <Input
              type="date"
              id="startDate"
              value={startRange.toISODate()}
              onChange={(e) => {
                setStartRange(DateTime.fromISO(e.target.value));
              }}
            />
          </FormControl>
          <Spacer />
          <FormControl maxW={"10em"}>
            <FormLabel htmlFor="endDate" textAlign={"center"}>
              End
            </FormLabel>
            <Input
              type="date"
              id="endDate"
              value={endRange.toISODate()}
              onChange={(e) => {
                setEndRange(DateTime.fromISO(e.target.value));
              }}
            />
          </FormControl>
        </Flex>
      </Container>
      <Accordion defaultIndex={[0]} allowMultiple my={6}>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Events
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Stack>
              {isLoading ? (
                <Spinner />
              ) : events?.length === 0 ? (
                <Center>
                  <Box borderRadius={"md"} borderWidth="1px" p={6}>
                    No events found
                  </Box>
                </Center>
              ) : (
                events
                  ?.sort(
                    (a, b) =>
                      DateTime.fromISO(a.startDate).toSeconds() -
                      DateTime.fromISO(b.startDate).toSeconds()
                  )
                  .map((event) => (
                    <LinkBox
                      key={event.id}
                      p={5}
                      borderWidth={"medium"}
                      borderRadius={"lg"}
                    >
                      <Flex>
                        <Box>
                          {event.allDay ? (
                            <Badge
                              borderRadius="full"
                              px="2"
                              colorScheme="blue"
                            >
                              All Day
                            </Badge>
                          ) : null}
                          <Text
                            fontSize="md"
                            fontWeight={"semibold"}
                            color="gray.600"
                          >
                            {DateTime.fromISO(event.startDate).toLocaleString()}
                            {" - "}
                            {DateTime.fromISO(event.endDate).toLocaleString()}
                          </Text>

                          <Text
                            fontSize="xl"
                            fontWeight={"semibold"}
                            as={Link}
                            to={`/event/${event.id}/view`}
                          >
                            {event.title}
                          </Text>
                          <Text>{event.description}</Text>
                        </Box>
                        <Spacer />
                        <Center>
                          <FormControl width={"8em"}>
                            <FormLabel
                              htmlFor={`rsvpSelect${event.id}`}
                              textAlign="center"
                            >
                              RSVP Status
                            </FormLabel>
                            <RSVPSelect
                              eventId={event.id}
                              id={`rsvpSelect${event.id}`}
                            />
                          </FormControl>
                        </Center>
                      </Flex>
                    </LinkBox>
                  ))
              )}
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Container maxW="container.sm">
        <StatusForRangeButton
          // w="14em"
          to={endRange.toJSDate().toISOString()}
          from={startRange.toJSDate().toISOString()}
        />
      </Container>
    </>
  );
};

export default Agenda;
