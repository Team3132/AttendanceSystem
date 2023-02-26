/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Rank of a team in a district.
 */
export type District_Ranking = {
    /**
     * TBA team key for the team.
     */
    team_key: string;
    /**
     * Numerical rank of the team, 1 being top rank.
     */
    rank: number;
    /**
     * Any points added to a team as a result of the rookie bonus.
     */
    rookie_bonus?: number;
    /**
     * Total district points for the team.
     */
    point_total: number;
    /**
     * List of events that contributed to the point total for the team.
     */
    event_points?: Array<{
        /**
         * `true` if this event is a District Championship event.
         */
        district_cmp: boolean;
        /**
         * Total points awarded at this event.
         */
        total: number;
        /**
         * Points awarded for alliance selection.
         */
        alliance_points: number;
        /**
         * Points awarded for elimination match performance.
         */
        elim_points: number;
        /**
         * Points awarded for event awards.
         */
        award_points: number;
        /**
         * TBA Event key for this event.
         */
        event_key: string;
        /**
         * Points awarded for qualification match performance.
         */
        qual_points: number;
    }>;
};

