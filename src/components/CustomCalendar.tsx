import { Event } from "@/generated";
import {
  Box,
  Button,
  Flex,
  FlexProps,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { DateTime, DateTimeUnit } from "luxon";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// export class Month {
//   private firstDayOfMonth: DateTime;
//   private lastDayOfMonth: DateTime;
//   private firstDayOfWeek: DateTime;
//   public weeks: Week[] = [];

//   constructor(public initialDate: DateTime) {
//     this.firstDayOfMonth = initialDate.startOf("month");
//     this.lastDayOfMonth = initialDate.endOf("month");
//     this.firstDayOfWeek = this.firstDayOfMonth.startOf("week");

//     const daysInMonth = Math.round(
//       this.lastDayOfMonth.diff(this.firstDayOfMonth, "days").days
//     );

//     const weeksInMonth = Math.ceil(daysInMonth / 7);
//     for (let i = 0; i < weeksInMonth; i++) {
//       const week = new Week(this.firstDayOfWeek.plus({ weeks: i }));
//       this.weeks.push(week);
//     }
//   }

//   get offset(): number {
//     return this.firstDayOfWeek.weekday;
//   }

//   get dateRange(): [DateTime, DateTime] {
//     return [this.firstDayOfMonth, this.lastDayOfMonth];
//   }

//   get next(): DateTime {
//     return this.lastDayOfMonth.plus({ days: 1 });
//   }
// }

// export class Week {
//   public days: Day[] = [];

//   constructor(public startDate: DateTime, public events: Array<Event> = []) {
//     for (let i = 0; i < 7; i++) {
//       const day = new Day(startDate.plus({ days: i }));
//       this.days.push(day);
//     }
//   }

//   get getDays(): number {
//     return this.days.length;
//   }
// }

// export class Day {
//   constructor(public date: DateTime) {}
// }
interface MonthProps {
  initialDate: DateTime;
  events?: Event[];
  onRange?: (start: DateTime, end: DateTime) => void;
}

const filteredEvents = (
  events: Event[] = [],
  date: DateTime,
  unit: DateTimeUnit
) =>
  events.filter(
    (event) =>
      date.hasSame(DateTime.fromISO(event.startDate), unit) ||
      date.hasSame(DateTime.fromISO(event.endDate), unit)
  );

const Day: React.FC<{ date: DateTime; events: Event[] }> = ({
  date,
  events,
}) => {
  const { colorMode } = useColorMode();
  const todayColour = colorMode === "light" ? "blue.200" : "blue.700";
  const disabledColour = colorMode === "light" ? "gray.300" : "gray.600";
  const borderColour = colorMode === "light" ? "gray.300" : "gray.600";
  // Add params to link overlay
  return (
    <LinkBox
      w="8em"
      h="8em"
      borderWidth={"1px"}
      borderColor={borderColour}
      bgColor={DateTime.local().hasSame(date, "day") ? todayColour : undefined}
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

const Week: React.FC<{ startDate: DateTime; events: Event[] }> = ({
  startDate,
  events,
}) => {
  const [days, setDays] = useState<DateTime[]>([]);
  useEffect(() => {
    const tempDays = Array(7)
      .fill(0)
      .map((data, index) => startDate.plus({ days: index }));
    setDays(tempDays);
  }, [startDate]);

  return (
    <Flex flexDirection={"row"}>
      {days.map((day) => (
        <Day
          date={day}
          events={filteredEvents(events, day, "day")}
          key={day.toMillis()}
        />
      ))}
    </Flex>
  );
};

const Month: React.FC<MonthProps & FlexProps> = ({
  initialDate,
  events,
  onRange,
  ...flexProps
}) => {
  const { colorMode } = useColorMode();
  const [weeks, setWeeks] = useState<DateTime[]>([]);
  const borderColour = colorMode === "light" ? "gray.300" : "gray.600";
  useEffect(() => {
    const firstDayOfMonth = initialDate.startOf("month");
    const lastDayOfMonth = initialDate.endOf("month");
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
  }, [initialDate]);

  return (
    <Flex {...flexProps} flexDirection={"column"}>
      <Flex>
        {new Array(7).fill(0).map((data, index) => (
          <Box
            w="8em"
            borderWidth={"1px"}
            borderColor={borderColour}
            textAlign="center"
          >
            {initialDate.startOf("week").plus({ day: index }).weekdayLong}
          </Box>
        ))}
      </Flex>
      {weeks.map((week) => (
        <Week
          startDate={week}
          events={filteredEvents(events, week, "week")}
          key={week.toMillis()}
        />
      ))}
    </Flex>
  );
};
export default Month;
