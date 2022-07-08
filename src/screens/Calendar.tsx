import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Calendar, luxonLocalizer, SlotInfo } from "react-big-calendar";
import { Outlet, useNavigate } from "react-router-dom";
import { Event } from "../generated";
import { useEvents, useMe } from "../hooks";
export const CalendarScreen: React.FC = () => {
  /** User Data */
  const { user, isLoading, isError } = useMe();

  /** Event Data */
  const {
    events: apiEvents,
    isLoading: isEventsLoading,
    isError: isEventsError,
  } = useEvents();
  const [mergedEvents, setMergedEvents] = useState<Event[]>([]);
  const [localEvents, setLocalEvents] = useState<Event[]>([]);
  const localizer = luxonLocalizer(DateTime);
  const navigate = useNavigate();
  useEffect(() => {
    setMergedEvents([...(apiEvents ?? []), ...localEvents]);
  }, [localEvents, apiEvents]);

  /** Handlers */
  const selectEventHandler: (event: {
    id: string;
    allDay: boolean;
    title: string;
    start: Date;
    end: Date;
    resource: string;
  }) => void = (event) => navigate(`/calendar/${event.id}/view`);

  const selectSlotHandler = (slotInfo: SlotInfo) =>
    navigate(
      `/calendar/create?startDate=${slotInfo.start.toISOString()}&endDate=${slotInfo.end.toISOString()}`
    );

  return (
    <>
      <Outlet />
      <Calendar
        localizer={localizer}
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
        // startAccessor="start"
        // endAccessor="end"
        style={{ height: 800 }}
        selectable={true}
        onSelectEvent={(event) => selectEventHandler(event)}
        onSelectSlot={selectSlotHandler}
      />
    </>
  );
};
