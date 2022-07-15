import {
  Badge,
  Divider,
  Heading,
  LinkBox,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { DateTime } from "luxon";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../hooks";

export const Agenda: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    new Date(),
    new Date(),
  ]);

  const { events, isLoading } = useEvents(
    undefined,
    selectedDates[0],
    selectedDates[1]
  );

  return (
    <>
      <Heading textAlign={"center"} mt={6}>
        Agenda
      </Heading>
      <Divider my={6} />
      <RangeDatepicker
        selectedDates={selectedDates}
        onDateChange={setSelectedDates}
      />
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
