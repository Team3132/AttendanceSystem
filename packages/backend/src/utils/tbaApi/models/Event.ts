/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { District_List } from './District_List';
import type { Webcast } from './Webcast';

export type Event = {
    /**
     * TBA event key with the format yyyy[EVENT_CODE], where yyyy is the year, and EVENT_CODE is the event code of the event.
     */
    key: string;
    /**
     * Official name of event on record either provided by FIRST or organizers of offseason event.
     */
    name: string;
    /**
     * Event short code, as provided by FIRST.
     */
    event_code: string;
    /**
     * Event Type, as defined here: https://github.com/the-blue-alliance/the-blue-alliance/blob/master/consts/event_type.py#L2
     */
    event_type: number;
    district?: District_List;
    /**
     * City, town, village, etc. the event is located in.
     */
    city?: string;
    /**
     * State or Province the event is located in.
     */
    state_prov?: string;
    /**
     * Country the event is located in.
     */
    country?: string;
    /**
     * Event start date in `yyyy-mm-dd` format.
     */
    start_date: string;
    /**
     * Event end date in `yyyy-mm-dd` format.
     */
    end_date: string;
    /**
     * Year the event data is for.
     */
    year: number;
    /**
     * Same as `name` but doesn't include event specifiers, such as 'Regional' or 'District'. May be null.
     */
    short_name?: string;
    /**
     * Event Type, eg Regional, District, or Offseason.
     */
    event_type_string: string;
    /**
     * Week of the event relative to the first official season event, zero-indexed. Only valid for Regionals, Districts, and District Championships. Null otherwise. (Eg. A season with a week 0 'preseason' event does not count, and week 1 events will show 0 here. Seasons with a week 0.5 regional event will show week 0 for those event(s) and week 1 for week 1 events and so on.)
     */
    week?: number;
    /**
     * Address of the event's venue, if available.
     */
    address?: string;
    /**
     * Postal code from the event address.
     */
    postal_code?: string;
    /**
     * Google Maps Place ID for the event address.
     */
    gmaps_place_id?: string;
    /**
     * Link to address location on Google Maps.
     */
    gmaps_url?: string;
    /**
     * Latitude for the event address.
     */
    lat?: number;
    /**
     * Longitude for the event address.
     */
    lng?: number;
    /**
     * Name of the location at the address for the event, eg. Blue Alliance High School.
     */
    location_name?: string;
    /**
     * Timezone name.
     */
    timezone?: string;
    /**
     * The event's website, if any.
     */
    website?: string;
    /**
     * The FIRST internal Event ID, used to link to the event on the FRC webpage.
     */
    first_event_id?: string;
    /**
     * Public facing event code used by FIRST (on frc-events.firstinspires.org, for example)
     */
    first_event_code?: string;
    webcasts?: Array<Webcast>;
    /**
     * An array of event keys for the divisions at this event.
     */
    division_keys?: Array<string>;
    /**
     * The TBA Event key that represents the event's parent. Used to link back to the event from a division event. It is also the inverse relation of `divison_keys`.
     */
    parent_event_key?: string;
    /**
     * Playoff Type, as defined here: https://github.com/the-blue-alliance/the-blue-alliance/blob/master/consts/playoff_type.py#L4, or null.
     */
    playoff_type?: number;
    /**
     * String representation of the `playoff_type`, or null.
     */
    playoff_type_string?: string;
};

