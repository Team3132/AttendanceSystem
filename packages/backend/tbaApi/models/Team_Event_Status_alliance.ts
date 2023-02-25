/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Team_Event_Status_alliance_backup } from './Team_Event_Status_alliance_backup';

export type Team_Event_Status_alliance = {
    /**
     * Alliance name, may be null.
     */
    name?: string;
    /**
     * Alliance number.
     */
    number: number;
    backup?: Team_Event_Status_alliance_backup;
    /**
     * Order the team was picked in the alliance from 0-2, with 0 being alliance captain.
     */
    pick: number;
};

