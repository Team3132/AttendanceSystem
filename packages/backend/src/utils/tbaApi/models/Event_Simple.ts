/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { District_List } from './District_List';

export type Event_Simple = {
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
};

