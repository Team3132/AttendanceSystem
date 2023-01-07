import { useAuthStatus } from "@/features/auth";
import { Divider, Heading } from "@chakra-ui/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import luxon2Plugin from "@fullcalendar/luxon2";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { SlotInfo } from "react-big-calendar";
import { Outlet, useNavigate } from "react-router-dom";
import useEvents from "../hooks/useEvents";

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

  const events = useMemo(() => {
    return (
      apiEvents?.map((apiEvent) => ({
        id: apiEvent.id,
        title: apiEvent.title,
        allDay: apiEvent.allDay,
        start: apiEvent.startDate,
        end: apiEvent.endDate,
      })) ?? []
    );
  }, [apiEvents]);

  return (
    <>
      <Heading textAlign={"center"} mt={6}>
        Event Calendar
      </Heading>
      <Divider my={6} />
      <Outlet />
      <FullCalendar
        plugins={[
          luxon2Plugin,
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listYear",
        }}
        selectable={isAdmin}
        select={(sel) => {
          navigate(
            `/event/create?startDate=${sel.startStr}&endDate=${sel.endStr}`
          );
        }}
        events={events}
        eventClick={(event) => navigate(`/event/${event.event.id}`)}
        datesSet={(dates) =>
          setRange([
            DateTime.fromJSDate(dates.start),
            DateTime.fromJSDate(dates.end),
          ])
        }
      />
    </>
  );
}
