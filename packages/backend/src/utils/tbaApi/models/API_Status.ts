/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { API_Status_App_Version } from './API_Status_App_Version';

export type API_Status = {
    /**
     * Year of the current FRC season.
     */
    current_season: number;
    /**
     * Maximum FRC season year for valid queries.
     */
    max_season: number;
    /**
     * True if the entire FMS API provided by FIRST is down.
     */
    is_datafeed_down: boolean;
    /**
     * An array of strings containing event keys of any active events that are no longer updating.
     */
    down_events: Array<string>;
    ios: API_Status_App_Version;
    android: API_Status_App_Version;
};

