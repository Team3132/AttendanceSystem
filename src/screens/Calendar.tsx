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
  useConst,
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
import Toolbar from "react-big-calendar/lib/Toolbar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStatus, useEvents } from "../hooks";
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
  const localizer = luxonLocalizer(DateTime);
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
      <MenuItem as={Link} to={`/event/${eventId}/view`}>
        View
      </MenuItem>
      <MenuItem as={Link} to={`/event/${eventId}/edit`}>
        Edit
      </MenuItem>
      <MenuDivider />
      <MenuItem as={Link} to={`/event/${eventId}/scanin`}>
        Scan in
      </MenuItem>
    </MenuList>
  );
};

export default CalendarScreen;
