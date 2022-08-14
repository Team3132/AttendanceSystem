import { Event } from "@/generated";
import { Button, ButtonGroup, Center, Flex, Stack } from "@chakra-ui/react";
import loadable from "@loadable/component";
import { DateTime, DateTimeUnit } from "luxon";
import React from "react";
import {
  CalendarProvider,
  useCalendarDate,
  useCalendarView,
} from "./CalendarProvider";

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
  initialView?: View;
  onEmptyClicked?: (start: DateTime, end: DateTime) => void;
  onEventClicked?: (event: Event) => void;
};

const DayView = loadable(() => import("./DayView"));
const WeekView = loadable(() => import("./WeekView"));
const MonthView = loadable(() => import("./MonthView"));

const RootCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useCalendarDate();
  const [view, setView] = useCalendarView();

  return (
    <Flex flexDir={"column"}>
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
        <MonthView />
      ) : view === View.WEEK ? (
        <WeekView />
      ) : view === View.DAY ? (
        <DayView />
      ) : null}
    </Flex>
  );
};

const Calendar: React.FC<RootCalProps> = ({
  initialDate,
  events,
  onRange,
  initialView,
  onEmptyClicked,
  onEventClicked,
}) => {
  return (
    <CalendarProvider
      initialDate={initialDate}
      events={events}
      onRange={onRange}
      initialView={initialView}
      onEmptyClicked={onEmptyClicked}
      onEventClicked={onEventClicked}
    >
      <RootCalendar />
    </CalendarProvider>
  );
};

export default Calendar;
