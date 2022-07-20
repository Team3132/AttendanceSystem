import { Event } from "@/generated";
import {
  Box,
  Button,
  Flex,
  FlexProps,
  //   Link,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Spacer,
  Stack,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
// import { Box, Box } from "framer-motion";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { filteredEvents, MonthProps } from ".";

const MonthView: React.FC<MonthProps & FlexProps> = ({
  date,
  events,
  onRange,

  ...flexProps
}) => {
  const isMobile = useBreakpointValue<boolean>({ base: true, md: false });
  const { colorMode } = useColorMode();
  const [weeks, setWeeks] = useState<DateTime[]>([]);
  const borderColour = colorMode === "light" ? "gray.300" : "gray.600";
  useEffect(() => {
    const firstDayOfMonth = date.startOf("month");
    const lastDayOfMonth = date.endOf("month");
    const firstDayOfWeek = firstDayOfMonth.startOf("week");
    const daysInMonth = Math.round(
      lastDayOfMonth.diff(firstDayOfMonth, "days").days
    );
    const weeksInMonth = Math.ceil(daysInMonth / 7);
    const tempWeeks = Array(weeksInMonth)
      .fill(0)
      .map((data, index) => firstDayOfWeek.plus({ weeks: index }));
    setWeeks(tempWeeks);
    onRange && onRange(firstDayOfMonth, lastDayOfMonth);
  }, [date]);

  return (
    <>
      <SimpleGrid columns={7}>
        {new Array(7).fill(0).map((data, index) => (
          <Box
            // w="8em"
            key={index}
            borderWidth={"1px"}
            borderColor={borderColour}
            textAlign="center"
            flex="1 1 "
          >
            {isMobile
              ? date.startOf("week").plus({ day: index }).weekdayShort
              : date.startOf("week").plus({ day: index }).weekdayLong}
          </Box>
        ))}
        {weeks.map((week) => (
          <WeekRow
            startDate={week}
            events={filteredEvents(events, week, "week")}
            key={week.toMillis()}
          />
        ))}
      </SimpleGrid>
      {/* </Flex> */}
    </>
  );
};

const WeekRow: React.FC<{ startDate: DateTime; events: Event[] }> = ({
  startDate,
  events,
}) => {
  const beginningDate = startDate.startOf("week");
  const [days, setDays] = useState<DateTime[]>([]);
  useEffect(() => {
    const tempDays = Array(7)
      .fill(0)
      .map((data, index) => beginningDate.plus({ days: index }));
    setDays(tempDays);
  }, [startDate]);

  return (
    <>
      {days.map((day) => (
        <DayColumn
          initialDate={day}
          events={filteredEvents(events, day, "day")}
          key={day.toMillis()}
        />
      ))}
    </>
  );
};

const DayColumn: React.FC<{ initialDate: DateTime; events: Event[] }> = ({
  initialDate,
  events,
}) => {
  const { colorMode } = useColorMode();
  const todayColour = colorMode === "light" ? "blue.200" : "blue.700";
  const disabledColour = colorMode === "light" ? "gray.300" : "gray.600";
  const borderColour = colorMode === "light" ? "gray.300" : "gray.600";
  const date = initialDate.startOf("day");
  // Add params to link overlay
  return (
    <LinkBox
      style={{ aspectRatio: "1/1" }}
      borderWidth={"1px"}
      borderColor={borderColour}
      bgColor={DateTime.local().hasSame(date, "day") ? todayColour : undefined}
      overflowY="scroll"
      overflowX={"hidden"}
    >
      <LinkOverlay
        as={Link}
        to={`/event/create?startDate=${date
          .startOf("day")
          .toJSDate()
          .toISOString()}&endDate=${date
          .endOf("day")
          .toJSDate()
          .toISOString()}`}
      />
      <Flex>
        <Spacer />
        {date.day}
      </Flex>
      <Stack>
        {events.map((event) => (
          <Button
            size="sm"
            colorScheme={"blue"}
            key={event.id}
            as={Link}
            to={`/event/${event.id}/view`}
          >
            {event.title}
          </Button>
        ))}
      </Stack>
    </LinkBox>
  );
};
export default MonthView;
