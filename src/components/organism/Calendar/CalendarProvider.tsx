import { EventResponseType } from "@/generated";
import { DateTime } from "luxon";
import React, { useContext, useState } from "react";

enum View {
  MONTH = "month",
  WEEK = "week",
  DAY = "day",
}

export interface CalendarProviderProps {
  children?: React.ReactNode;
  initialDate?: DateTime;
  events?: EventResponseType[];
  onRange?: (start: DateTime, end: DateTime) => void;
  onEventClicked?: (event: EventResponseType) => void;
  onEmptyClicked?: (start: DateTime, end: DateTime) => void;
  initialView?: View;
}

export interface CalendarContextType {
  date: [DateTime, React.Dispatch<React.SetStateAction<DateTime>>];
  onRange: (start: DateTime, end: DateTime) => void;
  onEventClicked: (event: EventResponseType) => void;
  onEmptyClicked: (start: DateTime, end: DateTime) => void;
  events: EventResponseType[];
  view: [View, React.Dispatch<React.SetStateAction<View>>];
}

export const CalendarContext = React.createContext<CalendarContextType | null>(
  null
);

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
  initialDate,
  onRange = () => {},
  onEmptyClicked = () => {},
  onEventClicked = () => {},
  events = [],
  initialView,
}) => {
  const date = useState<DateTime>(initialDate ?? DateTime.local());
  const view = useState<View>(initialView ?? View.MONTH);
  return (
    <CalendarContext.Provider
      value={{ date, events, onRange, view, onEmptyClicked, onEventClicked }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarDate = () => {
  const { date } = useContext(CalendarContext) as CalendarContextType;
  return date;
};

export const useCalendarOnRange = () => {
  const { onRange } = useContext(CalendarContext) as CalendarContextType;
  return onRange;
};
export const useCalendarOnEventClicked = () => {
  const { onEventClicked } = useContext(CalendarContext) as CalendarContextType;
  return onEventClicked;
};
export const useCalendarOnEmptyClicked = () => {
  const { onEmptyClicked } = useContext(CalendarContext) as CalendarContextType;
  return onEmptyClicked;
};

export const useCalendarEvents = () => {
  const { events } = useContext(CalendarContext) as CalendarContextType;
  return events;
};

export const useCalendarView = () => {
  const { view } = useContext(CalendarContext) as CalendarContextType;
  return view;
};
