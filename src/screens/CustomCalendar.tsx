import { Calendar } from "@/components";
import { useEvents } from "@/hooks";
import { Divider, Heading, useConst } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CustomCalendar: React.FC = () => {
  const initialDate = useConst(DateTime.local());
  const dateNow = useConst<Date>(new Date());
  const [range, setRange] = useState<{ start: DateTime; end: DateTime }>();
  const [endRange, setEndRange] = useState<Date>();
  /** Event Data */
  const {
    events: apiEvents,
    isLoading: isEventsLoading,
    isError: isEventsError,
  } = useEvents(undefined, range?.start, range?.end);
  const navigate = useNavigate();
  return (
    <>
      <Heading textAlign={"center"} mt={6}>
        Custom Calendar
      </Heading>
      <Divider my={6} />
      {/* <Container maxW="container.lg"> */}
      {/* <Center> */}
      <Calendar
        initialDate={initialDate}
        onRange={(start, end) => setRange({ start, end })}
        onEmptyClicked={(start, end) =>
          navigate(
            `/event/create?startDate=${start
              .toJSDate()
              .toISOString()}&endDate=${end.toJSDate().toISOString()}`
          )
        }
        onEventClicked={(event) => navigate(`/event/${event.id}`)}
        events={apiEvents}
      />
      {/* </Center>
      </Container> */}
    </>
  );
};
export default CustomCalendar;
