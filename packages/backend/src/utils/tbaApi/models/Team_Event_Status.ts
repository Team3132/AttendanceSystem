/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Team_Event_Status_alliance } from './Team_Event_Status_alliance';
import type { Team_Event_Status_playoff } from './Team_Event_Status_playoff';
import type { Team_Event_Status_rank } from './Team_Event_Status_rank';

export type Team_Event_Status = {
    qual?: Team_Event_Status_rank;
    alliance?: Team_Event_Status_alliance;
    playoff?: Team_Event_Status_playoff;
    /**
     * An HTML formatted string suitable for display to the user containing the team's alliance pick status.
     */
    alliance_status_str?: string;
    /**
     * An HTML formatter string suitable for display to the user containing the team's playoff status.
     */
    playoff_status_str?: string;
    /**
     * An HTML formatted string suitable for display to the user containing the team's overall status summary of the event.
     */
    overall_status_str?: string;
    /**
     * TBA match key for the next match the team is scheduled to play in at this event, or null.
     */
    next_match_key?: string;
    /**
     * TBA match key for the last match the team played in at this event, or null.
     */
    last_match_key?: string;
};

