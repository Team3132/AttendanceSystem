import { Calendar } from "@/components";
import { useEvents } from "@/hooks";
import { Divider, Heading, useConst } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useState } from "react";

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
        events={apiEvents}
      />
      {/* </Center>
      </Container> */}
    </>
  );
};
export default CustomCalendar;
