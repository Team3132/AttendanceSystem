/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WLT_Record } from './WLT_Record';

/**
 * Playoff status for this team, may be null if the team did not make playoffs, or playoffs have not begun.
 */
export type Team_Event_Status_playoff = {
    /**
     * The highest playoff level the team reached.
     */
    level?: Team_Event_Status_playoff.level;
    current_level_record?: WLT_Record;
    record?: WLT_Record;
    /**
     * Current competition status for the playoffs.
     */
    status?: Team_Event_Status_playoff.status;
    /**
     * The average match score during playoffs. Year specific. May be null if not relevant for a given year.
     */
    playoff_average?: number;
};

export namespace Team_Event_Status_playoff {

    /**
     * The highest playoff level the team reached.
     */
    export enum level {
        QM = 'qm',
        EF = 'ef',
        QF = 'qf',
        SF = 'sf',
        F = 'f',
    }

    /**
     * Current competition status for the playoffs.
     */
    export enum status {
        WON = 'won',
        ELIMINATED = 'eliminated',
        PLAYING = 'playing',
    }


}

