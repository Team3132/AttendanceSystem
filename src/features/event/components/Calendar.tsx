import { useAuthStatus } from "@/features/auth";
import { Divider, Heading } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { SlotInfo } from "react-big-calendar";
import Toolbar from "react-big-calendar/lib/Toolbar";
import { Outlet, useNavigate } from "react-router-dom";
import useEvents from "../hooks/useEvents";
import { CalendarWithLocalizer } from "./CalendarWithLocalizer";

export default function Calendar() {
  /** User Data */
  const { isAdmin } = useAuthStatus();

  const [range, setRange] = useState<[DateTime, DateTime]>();
  /** Event Data */
  const {
    data: apiEvents,
    isLoading: isEventsLoading,
    isError: isEventsError,
  } = useEvents(undefined, range?.[0], range?.[1]);
  const navigate = useNavigate();

  /** Handlers */
  const selectEventHandler: (event: {
    id: string;
    allDay: boolean;
    title: string;
    start: Date;
    end: Date;
    resource: string;
  }) => void = (event) => navigate(`/event/${event.id}/edit`);

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
          setRange([
            DateTime.fromJSDate(dates.start),
            DateTime.fromJSDate(dates.end),
          ]);
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
}

const InitialRangeChangeToolbar = (props: any) => {
  useEffect(() => {
    props.onView(props.view);
  }, []);
  return <Toolbar {...props} />;
};
