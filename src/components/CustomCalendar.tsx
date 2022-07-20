import { Event } from "@/generated";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FlexProps,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Spacer,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
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
  date: DateTime;
  events?: Event[];
  onRange?: (start: DateTime, end: DateTime) => void;
}

// type View = "month" | "week" | "day";

enum View {
  MONTH = "month",
  WEEK = "week",
  DAY = "day",
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

const MonthView: React.FC<MonthProps & FlexProps> = ({
  date,
  events,
  onRange,

  ...flexProps
}) => {
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
            {date.startOf("week").plus({ day: index }).weekdayLong}
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

const WeekView: React.FC<MonthProps & FlexProps> = ({
  date,
  events,
  onRange,

  ...flexProps
}) => {
  const { colorMode } = useColorMode();
  const [days, setDays] = useState<DateTime[]>([]);
  const borderColour = colorMode === "light" ? "gray.300" : "gray.600";
  useEffect(() => {
    const lastDayOfWeek = date.endOf("week");
    const firstDayOfWeek = date.startOf("week");

    const tempDays = Array(7)
      .fill(0)
      .map((data, index) => firstDayOfWeek.plus({ day: index }));
    setDays(tempDays);

    onRange && onRange(firstDayOfWeek, lastDayOfWeek);
  }, [date]);

  return (
    <>
      <Flex {...flexProps} flexDirection={"column"} w="100%">
        <SimpleGrid columns={7}>
          {new Array(7).fill(0).map((data, index) => (
            <Box
              // w="8em"
              key={index}
              borderWidth={"1px"}
              borderColor={borderColour}
              textAlign="center"
            >
              {date.startOf("week").plus({ day: index }).weekdayLong}
            </Box>
          ))}

          {days.map((day, index) => (
            <Box>
              {/* {day.day} */}
              <LinkBox
                // w="8em"
                // h="3em"
                key={day.day}
                borderWidth={"1px"}
                borderColor={borderColour}
                textAlign="center"
              >
                <LinkOverlay
                  as={Link}
                  to={`/event/create?startDate=${day
                    .startOf("day")
                    .toJSDate()
                    .toISOString()}&endDate=${day
                    .endOf("day")
                    .toJSDate()
                    .toISOString()}&allDay=true`}
                />
                {/* {filteredEvents(events, day, "day").length} */}
                {filteredEvents(events, day, "day")
                  .filter((event) => event.allDay)
                  .map((event) => (
                    <Button
                      colorScheme={"blue"}
                      as={Link}
                      to={`/event/${event.id}/view`}
                    >
                      {event.title}
                    </Button>
                  ))}
              </LinkBox>
            </Box>
          ))}
          {days.map((day, index) => (
            <Box>
              {/* {day.day} */}
              <LinkBox
                // w="8em"
                // h="3em"
                key={day.day}
                borderWidth={"1px"}
                borderColor={borderColour}
                textAlign="center"
              >
                <LinkOverlay
                  as={Link}
                  to={`/event/create?startDate=${day
                    .startOf("day")
                    .toJSDate()
                    .toISOString()}&endDate=${day
                    .endOf("day")
                    .toJSDate()
                    .toISOString()}`}
                />
                {/* {filteredEvents(events, day, "day").length} */}
                {filteredEvents(events, day, "day")
                  .filter((event) => !event.allDay)
                  .map((event) => (
                    <Button
                      colorScheme={"blue"}
                      as={Link}
                      to={`/event/${event.id}/view`}
                    >
                      {event.title}
                    </Button>
                  ))}
              </LinkBox>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </>
  );
};

const DayView: React.FC<MonthProps & FlexProps> = ({
  date,
  events,
  onRange,

  ...flexProps
}) => {
  const { colorMode } = useColorMode();
  const [day, setDay] = useState<DateTime>();
  const [hours, setHours] = useState<[DateTime, DateTime][]>();
  const borderColour = colorMode === "light" ? "gray.300" : "gray.600";
  const todayColour = colorMode === "light" ? "blue.200" : "blue.700";
  useEffect(() => {
    const dayEnd = date.endOf("day");
    const dayBegin = date.startOf("day");
    const tempHours: [DateTime, DateTime][] = new Array(24)
      .fill(0)
      .map((hour, index) => [
        dayBegin.startOf("hour").plus({ hour: index }),
        dayBegin.endOf("hour").plus({ hour: index }),
      ]);
    setHours(tempHours);
    setDay(date);

    onRange && onRange(dayBegin, dayEnd);
  }, [date]);
  return (
    <Flex {...flexProps} flexDirection={"column"}>
      <Flex>{day?.toLocaleString(DateTime.DATETIME_FULL)}</Flex>{" "}
      {/** All Day */}
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th>Hour</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {hours?.map((hour) => (
              <LinkBox
                borderColor={borderColour}
                as={Tr}
                bgColor={
                  DateTime.local().hasSame(hour[0], "hour")
                    ? todayColour
                    : undefined
                }
              >
                <Td fontWeight={"semibold"} fontSize={"sm"}>
                  <Stack divider={<>-</>}>
                    <Text>{hour[0].toLocaleString(DateTime.TIME_SIMPLE)}</Text>
                    <Text>{hour[1].toLocaleString(DateTime.TIME_SIMPLE)}</Text>
                  </Stack>
                </Td>
                <Td></Td>
              </LinkBox>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Hour</Th>
              <Th></Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Flex>
  );
};

type RootCalProps = {
  initialDate?: DateTime;
  onRange: (start: DateTime, end: DateTime) => void;
  events?: Event[];
} & FlexProps;

const RootCal: React.FC<RootCalProps> = ({
  onRange,
  initialDate,
  events,
  ...flexProps
}) => {
  const [currentDate, setCurrentDate] = useState<DateTime>(
    initialDate ?? DateTime.local()
  );
  const [view, setView] = useState<View>(View.MONTH);
  return (
    <Flex flexDir={"column"} {...flexProps}>
      <Flex py={2}>
        <ButtonGroup isAttached variant={"outline"}>
          <Button onClick={() => setCurrentDate(DateTime.local())}>
            Today
          </Button>
          <Button
            onClick={() => setCurrentDate(currentDate.minus({ [view]: 1 }))}
          >
            Back
          </Button>
          <Button
            onClick={() => setCurrentDate(currentDate.plus({ [view]: 1 }))}
          >
            Next
          </Button>
        </ButtonGroup>
        <Spacer />
        <Center>
          {currentDate.monthLong} {currentDate.year}
        </Center>

        <Spacer />
        <ButtonGroup isAttached variant={"outline"}>
          <Button
            isActive={view === "month"}
            onClick={() => setView(View.MONTH)}
          >
            Month
          </Button>
          <Button
            isActive={view === "week"}
            onClick={() => setView(View.WEEK)}
            // isDisabled
          >
            Week
          </Button>
          <Button
            isActive={view === "day"}
            onClick={() => setView(View.DAY)}
            // isDisabled
          >
            Day
          </Button>
          {/* <Button isDisabled>Agenda</Button> */}
        </ButtonGroup>
      </Flex>

      {view === View.MONTH ? (
        <MonthView date={currentDate} events={events} onRange={onRange} />
      ) : view === View.WEEK ? (
        <WeekView date={currentDate} events={events} onRange={onRange} />
      ) : view === View.DAY ? (
        <DayView date={currentDate} events={events} onRange={onRange} />
      ) : null}
    </Flex>
  );
};

export default RootCal;
