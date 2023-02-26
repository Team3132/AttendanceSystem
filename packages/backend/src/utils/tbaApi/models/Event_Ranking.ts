/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WLT_Record } from './WLT_Record';

export type Event_Ranking = {
    /**
     * List of rankings at the event.
     */
    rankings: Array<{
        /**
         * Number of matches played by this team.
         */
        matches_played: number;
        /**
         * The average match score during qualifications. Year specific. May be null if not relevant for a given year.
         */
        qual_average?: number;
        /**
         * Additional special data on the team's performance calculated by TBA.
         */
        extra_stats?: Array<number>;
        /**
         * Additional year-specific information, may be null. See parent `sort_order_info` for details.
         */
        sort_orders?: Array<number>;
        record: WLT_Record;
        /**
         * The team's rank at the event as provided by FIRST.
         */
        rank: number;
        /**
         * Number of times disqualified.
         */
        dq: number;
        /**
         * The team with this rank.
         */
        team_key: string;
    }>;
    /**
     * List of special TBA-generated values provided in the `extra_stats` array for each item.
     */
    extra_stats_info?: Array<{
        /**
         * Integer expressing the number of digits of precision in the number provided in `sort_orders`.
         */
        precision: number;
        /**
         * Name of the field used in the `extra_stats` array.
         */
        name: string;
    }>;
    /**
     * List of year-specific values provided in the `sort_orders` array for each team.
     */
    sort_order_info: Array<{
        /**
         * Integer expressing the number of digits of precision in the number provided in `sort_orders`.
         */
        precision: number;
        /**
         * Name of the field used in the `sort_order` array.
         */
        name: string;
    }>;
};

