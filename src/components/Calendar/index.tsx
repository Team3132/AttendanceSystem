import { Event } from "@/generated";
import {
  Button,
  ButtonGroup,
  Center,
  Flex,
  FlexProps,
  Stack,
} from "@chakra-ui/react";
import loadable from "@loadable/component";
import { DateTime, DateTimeUnit } from "luxon";
import React, { useState } from "react";

export interface MonthProps {
  date: DateTime;
  events?: Event[];
  onRange?: (start: DateTime, end: DateTime) => void;
}

enum View {
  MONTH = "month",
  WEEK = "week",
  DAY = "day",
}

export const filteredEvents = (
  events: Event[] = [],
  date: DateTime,
  unit: DateTimeUnit
) =>
  events.filter(
    (event) =>
      date.hasSame(DateTime.fromISO(event.startDate), unit) ||
      date.hasSame(DateTime.fromISO(event.endDate), unit)
  );

type RootCalProps = {
  initialDate?: DateTime;
  onRange: (start: DateTime, end: DateTime) => void;
  events?: Event[];
} & FlexProps;

const DayView = loadable(() => import("./DayView"));
const WeekView = loadable(() => import("./WeekView"));
const MonthView = loadable(() => import("./MonthView"));

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
      <Center>
        <Stack direction={["column", "row"]} m={2} spacing={5}>
          <Center>
            <ButtonGroup isAttached variant={"outline"}>
              <Button
                onClick={() => setCurrentDate(currentDate.minus({ [view]: 1 }))}
              >
                Back
              </Button>
              <Button onClick={() => setCurrentDate(DateTime.local())}>
                Today
              </Button>
              <Button
                onClick={() => setCurrentDate(currentDate.plus({ [view]: 1 }))}
              >
                Next
              </Button>
            </ButtonGroup>
          </Center>
          <Center>
            {view === View.MONTH
              ? `${currentDate.monthLong} ${currentDate.year}`
              : view === View.WEEK
              ? `${currentDate
                  .startOf("week")
                  .toLocaleString(DateTime.DATE_MED)} - ${currentDate
                  .endOf("week")
                  .toLocaleString(DateTime.DATE_MED)}`
              : `${currentDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}`}
          </Center>
          <Center>
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
              >
                Week
              </Button>
              <Button
                isActive={view === "day"}
                onClick={() => setView(View.DAY)}
              >
                Day
              </Button>
            </ButtonGroup>
          </Center>
        </Stack>
      </Center>

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
