import {
  Badge,
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
import { DateTime } from "luxon";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../hooks";

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
      <Divider my={6} />
      <Stack>
        {isLoading ? (
          <Spinner />
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
                {event.allDay ? (
                  <Badge borderRadius="full" px="2" colorScheme="blue">
                    All Day
                  </Badge>
                ) : null}
                <Text fontSize="md" fontWeight={"semibold"} color="gray.600">
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
              </LinkBox>
            )) ?? <>No events.</>
        )}
      </Stack>
    </>
  );
};

export default Agenda;
