import {
  Divider,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuListProps,
  Portal,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import {
  Calendar,
  EventProps,
  EventWrapperProps,
  luxonLocalizer,
  SlotInfo,
} from "react-big-calendar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Event } from "../generated";
import { useAuthStatus, useEvents } from "../hooks";
export const CalendarScreen: React.FC = () => {
  /** User Data */
  const { isAdmin } = useAuthStatus();

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
  }) => void = (event) =>
    isAdmin
      ? navigate(`/calendar/${event.id}/edit`)
      : navigate(`/calendar/${event.id}/view`);

  const selectSlotHandler = (slotInfo: SlotInfo) =>
    navigate(
      `/calendar/create?startDate=${slotInfo.start.toISOString()}&endDate=${slotInfo.end.toISOString()}`
    );

  return (
    <>
      <Heading textAlign={"center"} mt={6}>
        Event Calendar
      </Heading>
      <Divider my={6} />
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
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        selectable={isAdmin}
        onSelectEvent={(event) => selectEventHandler(event)}
        onSelectSlot={selectSlotHandler}
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

type EventWrapperRealProps = EventWrapperProps<{
  id: string;
  allDay: boolean;
  title: string;
  start: Date;
  end: Date;
  resource: string;
}>;

const EventWrapper: React.FC<EventWrapperRealProps> = (props) => {
  const realProps = props as EventWrapperRealProps & { children: any };
  return (
    <Menu isLazy>
      <MenuButton
        as="div"
        style={props.style}
        className={realProps.className}
        // zIndex={4}
      >
        {realProps.children}
      </MenuButton>
      <Portal>
        <EventMenuList zIndex={5} eventId={realProps.event.id} />
      </Portal>
    </Menu>
  );
};

const AgendaEventWrapper: React.ComponentType<
  EventProps<{
    id: string;
    allDay: boolean;
    title: string;
    start: Date;
    end: Date;
    resource: string;
  }>
> = (props) => {
  return (
    <Menu isLazy>
      <MenuButton>{props.title}</MenuButton>
      <Portal>
        <EventMenuList zIndex={5} eventId={props.event.id} />
      </Portal>
    </Menu>
  );
};

const EventMenuList: React.FC<
  Omit<MenuListProps, "children"> & { eventId: string }
> = ({ eventId, ...rest }) => {
  return (
    <MenuList {...rest}>
      <MenuItem as={Link} to={`/calendar/${eventId}/view`}>
        View
      </MenuItem>
      <MenuItem as={Link} to={`/calendar/${eventId}/edit`}>
        Edit
      </MenuItem>
      <MenuDivider />
      <MenuItem as={Link} to={`/calendar/${eventId}/scanin`}>
        Scan in
      </MenuItem>
    </MenuList>
  );
};
