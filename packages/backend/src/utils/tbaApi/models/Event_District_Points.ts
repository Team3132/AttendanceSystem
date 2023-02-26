/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Event_District_Points = {
    /**
     * Points gained for each team at the event. Stored as a key-value pair with the team key as the key, and an object describing the points as its value.
     */
    points: Record<string, {
        /**
         * Total points awarded at this event.
         */
        total: number;
        /**
         * Points awarded for alliance selection
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
         * Points awarded for qualification match performance.
         */
        qual_points: number;
    }>;
    /**
     * Tiebreaker values for each team at the event. Stored as a key-value pair with the team key as the key, and an object describing the tiebreaker elements as its value.
     */
    tiebreakers?: Record<string, {
        highest_qual_scores?: Array<number>;
        qual_wins?: number;
    }>;
};

