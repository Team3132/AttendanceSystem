/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WLT_Record } from './WLT_Record';

export type Team_Event_Status_rank = {
    /**
     * Number of teams ranked.
     */
    num_teams?: number;
    ranking?: {
        /**
         * Number of matches played.
         */
        matches_played?: number;
        /**
         * For some years, average qualification score. Can be null.
         */
        qual_average?: number;
        /**
         * Ordered list of values used to determine the rank. See the `sort_order_info` property for the name of each value.
         */
        sort_orders?: Array<number>;
        record?: WLT_Record;
        /**
         * Relative rank of this team.
         */
        rank?: number;
        /**
         * Number of matches the team was disqualified for.
         */
        dq?: number;
        /**
         * TBA team key for this rank.
         */
        team_key?: string;
    };
    /**
     * Ordered list of names corresponding to the elements of the `sort_orders` array.
     */
    sort_order_info?: Array<{
        /**
         * The number of digits of precision used for this value, eg `2` would correspond to a value of `101.11` while `0` would correspond to `101`.
         */
        precision?: number;
        /**
         * The descriptive name of the value used to sort the ranking.
         */
        name?: string;
    }>;
    status?: string;
};

