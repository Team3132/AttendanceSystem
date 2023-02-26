/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A Win-Loss-Tie record for a team, or an alliance.
 */
export type WLT_Record = {
    /**
     * Number of losses.
     */
    losses: number;
    /**
     * Number of wins.
     */
    wins: number;
    /**
     * Number of ties.
     */
    ties: number;
};

