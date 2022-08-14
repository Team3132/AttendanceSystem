import {
  Box,
  Button,
  Flex,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { filteredEvents } from ".";
import {
  useCalendarDate,
  useCalendarEvents,
  useCalendarOnEmptyClicked,
  useCalendarOnEventClicked,
  useCalendarOnRange,
} from "./CalendarProvider";

const WeekView: React.FC = () => {
  const isMobile = useBreakpointValue<boolean>({ base: true, md: false });
  const { colorMode } = useColorMode();
  const [days, setDays] = useState<DateTime[]>([]);
  const borderColour = colorMode === "light" ? "gray.300" : "gray.600";

  const [date] = useCalendarDate();
  const onRange = useCalendarOnRange();
  const events = useCalendarEvents();

  useEffect(() => {
    const lastDayOfWeek = date.endOf("week");
    const firstDayOfWeek = date.startOf("week");

    const tempDays = Array(7)
      .fill(0)
      .map((data, index) => firstDayOfWeek.plus({ day: index }));
    setDays(tempDays);

    onRange && onRange(firstDayOfWeek, lastDayOfWeek);
  }, [date]);

  const emptyClicked = useCalendarOnEmptyClicked();
  const eventClicked = useCalendarOnEventClicked();

  return (
    <>
      <Flex flexDirection={"column"} w="100%">
        <SimpleGrid columns={7}>
          {new Array(7).fill(0).map((data, index) => (
            <Box
              // w="8em"
              key={index}
              borderWidth={"1px"}
              borderColor={borderColour}
              textAlign="center"
            >
              {isMobile
                ? date.startOf("week").plus({ day: index }).weekdayShort
                : date.startOf("week").plus({ day: index }).weekdayLong}
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
                  // as={Link}
                  onClick={() => {
                    emptyClicked(day.startOf("day"), day.endOf("day"));
                  }}
                  // to={`/event/create?startDate=${day
                  //   .startOf("day")
                  //   .toJSDate()
                  //   .toISOString()}&endDate=${day
                  //   .endOf("day")
                  //   .toJSDate()
                  //   .toISOString()}&allDay=true`}
                />
                {/* {filteredEvents(events, day, "day").length} */}
                {filteredEvents(events, day, "day")
                  .filter((event) => event.allDay)
                  .map((event) => (
                    <Button
                      colorScheme={"blue"}
                      onClick={() => eventClicked(event)}
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
                  // as={Link}
                  onClick={() => {
                    emptyClicked(day.startOf("day"), day.endOf("day"));
                  }}
                  // to={`/event/create?startDate=${day
                  //   .startOf("day")
                  //   .toJSDate()
                  //   .toISOString()}&endDate=${day
                  //   .endOf("day")
                  //   .toJSDate()
                  //   .toISOString()}`}
                />
                {/* {filteredEvents(events, day, "day").length} */}
                {filteredEvents(events, day, "day")
                  .filter((event) => !event.allDay)
                  .map((event) => (
                    <Button
                      colorScheme={"blue"}
                      // as={Link}
                      onClick={() => {
                        eventClicked(event);
                      }}
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
export default WeekView;
