/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Match_alliance } from './Match_alliance';

export type Match = {
    /**
     * TBA match key with the format `yyyy[EVENT_CODE]_[COMP_LEVEL]m[MATCH_NUMBER]`, where `yyyy` is the year, and `EVENT_CODE` is the event code of the event, `COMP_LEVEL` is (qm, ef, qf, sf, f), and `MATCH_NUMBER` is the match number in the competition level. A set number may be appended to the competition level if more than one match in required per set.
     */
    key: string;
    /**
     * The competition level the match was played at.
     */
    comp_level: Match.comp_level;
    /**
     * The set number in a series of matches where more than one match is required in the match series.
     */
    set_number: number;
    /**
     * The match number of the match in the competition level.
     */
    match_number: number;
    /**
     * A list of alliances, the teams on the alliances, and their score.
     */
    alliances?: {
        red?: Match_alliance;
        blue?: Match_alliance;
    };
    /**
     * The color (red/blue) of the winning alliance. Will contain an empty string in the event of no winner, or a tie.
     */
    winning_alliance?: Match.winning_alliance;
    /**
     * Event key of the event the match was played at.
     */
    event_key: string;
    /**
     * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the scheduled match time, as taken from the published schedule.
     */
    time?: number;
    /**
     * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of actual match start time.
     */
    actual_time?: number;
    /**
     * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the TBA predicted match start time.
     */
    predicted_time?: number;
    /**
     * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) when the match result was posted.
     */
    post_result_time?: number;
    /**
     * Score breakdown for auto, teleop, etc. points. Varies from year to year. May be null.
     */
    score_breakdown?: any;
    /**
     * Array of video objects associated with this match.
     */
    videos?: Array<{
        /**
         * Can be one of 'youtube' or 'tba'
         */
        type?: string;
        /**
         * Unique key representing this video
         */
        key?: string;
    }>;
};

export namespace Match {

    /**
     * The competition level the match was played at.
     */
    export enum comp_level {
        QM = 'qm',
        EF = 'ef',
        QF = 'qf',
        SF = 'sf',
        F = 'f',
    }

    /**
     * The color (red/blue) of the winning alliance. Will contain an empty string in the event of no winner, or a tie.
     */
    export enum winning_alliance {
        RED = 'red',
        BLUE = 'blue',
    }


}

