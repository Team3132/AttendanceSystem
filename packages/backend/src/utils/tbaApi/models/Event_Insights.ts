/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A year-specific event insight object expressed as a JSON string, separated in to `qual` and `playoff` fields. See also Event_Insights_2016, Event_Insights_2017, etc.
 */
export type Event_Insights = {
    /**
     * Inights for the qualification round of an event
     */
    qual?: any;
    /**
     * Insights for the playoff round of an event
     */
    playoff?: any;
};

