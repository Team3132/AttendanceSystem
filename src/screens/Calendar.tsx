import { Divider, Heading, useConst } from "@chakra-ui/react";
import { CalendarWithLocalizer } from "@components";
import { useAuthStatus, useEvents } from "@hooks";
import { useEffect, useState } from "react";
import { SlotInfo } from "react-big-calendar";
import Toolbar from "react-big-calendar/lib/Toolbar";
import { Outlet, useNavigate } from "react-router-dom";

export const CalendarScreen: React.FC = () => {
  /** User Data */
  const { isAdmin } = useAuthStatus();

  const dateNow = useConst<Date>(new Date());
  const [startRange, setStartRange] = useState<Date>();
  const [endRange, setEndRange] = useState<Date>();
  /** Event Data */
  const {
    events: apiEvents,
    isLoading: isEventsLoading,
    isError: isEventsError,
  } = useEvents(undefined, startRange, endRange);
  const navigate = useNavigate();

  /** Handlers */
  const selectEventHandler: (event: {
    id: string;
    allDay: boolean;
    title: string;
    start: Date;
    end: Date;
    resource: string;
  }) => void = (event) =>
    isAdmin
      ? navigate(`/event/${event.id}/edit`)
      : navigate(`/event/${event.id}/view`);

  const selectSlotHandler = (slotInfo: SlotInfo) =>
    navigate(
      `/event/create?startDate=${slotInfo.start.toISOString()}&endDate=${slotInfo.end.toISOString()}`
    );

  return (
    <>
      <Heading textAlign={"center"} mt={6}>
        Event Calendar
      </Heading>
      <Divider my={6} />
      <Outlet />
      <CalendarWithLocalizer
        events={
          apiEvents?.map((event) => ({
            id: event.id,
            allDay: event.allDay,
            title: event.title,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            resource: "any",
          })) ?? []
        }
        style={{ height: 800 }}
        selectable={isAdmin}
        onSelectEvent={(event) => {
          const typedEvent = event as {
            id: string;
            allDay: boolean;
            title: string;
            start: Date;
            end: Date;
            resource: string;
          };
          selectEventHandler(typedEvent);
        }}
        onSelectSlot={selectSlotHandler}
        onRangeChange={(data) => {
          const dates = data as {
            start: Date;
            end: Date;
          };
          setEndRange(dates.end);
          setStartRange(dates.start);
        }}
        components={{ toolbar: InitialRangeChangeToolbar }}
        // components={{
        //   eventWrapper: EventWrapper,
        //   agenda: {
        //     event: AgendaEventWrapper,
        //   },
        // }}
      />
    </>
  );
};

const InitialRangeChangeToolbar = (props: any) => {
  useEffect(() => {
    props.onView(props.view);
  }, []);
  return <Toolbar {...props} />;
};

export default CalendarScreen;
