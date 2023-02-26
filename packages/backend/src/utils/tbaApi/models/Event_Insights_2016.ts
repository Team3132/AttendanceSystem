/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Insights for FIRST Stronghold qualification and elimination matches.
 */
export type Event_Insights_2016 = {
    /**
     * For the Low Bar - An array with three values, number of times damaged, number of opportunities to damage, and percentage.
     */
    LowBar: Array<number>;
    /**
     * For the Cheval De Frise - An array with three values, number of times damaged, number of opportunities to damage, and percentage.
     */
    A_ChevalDeFrise: Array<number>;
    /**
     * For the Portcullis - An array with three values, number of times damaged, number of opportunities to damage, and percentage.
     */
    A_Portcullis: Array<number>;
    /**
     * For the Ramparts - An array with three values, number of times damaged, number of opportunities to damage, and percentage.
     */
    B_Ramparts: Array<number>;
    /**
     * For the Moat - An array with three values, number of times damaged, number of opportunities to damage, and percentage.
     */
    B_Moat: Array<number>;
    /**
     * For the Sally Port - An array with three values, number of times damaged, number of opportunities to damage, and percentage.
     */
    C_SallyPort: Array<number>;
    /**
     * For the Drawbridge - An array with three values, number of times damaged, number of opportunities to damage, and percentage.
     */
    C_Drawbridge: Array<number>;
    /**
     * For the Rough Terrain - An array with three values, number of times damaged, number of opportunities to damage, and percentage.
     */
    D_RoughTerrain: Array<number>;
    /**
     * For the Rock Wall - An array with three values, number of times damaged, number of opportunities to damage, and percentage.
     */
    D_RockWall: Array<number>;
    /**
     * Average number of high goals scored.
     */
    average_high_goals: number;
    /**
     * Average number of low goals scored.
     */
    average_low_goals: number;
    /**
     * An array with three values, number of times breached, number of opportunities to breach, and percentage.
     */
    breaches: Array<number>;
    /**
     * An array with three values, number of times scaled, number of opportunities to scale, and percentage.
     */
    scales: Array<number>;
    /**
     * An array with three values, number of times challenged, number of opportunities to challenge, and percentage.
     */
    challenges: Array<number>;
    /**
     * An array with three values, number of times captured, number of opportunities to capture, and percentage.
     */
    captures: Array<number>;
    /**
     * Average winning score.
     */
    average_win_score: number;
    /**
     * Average margin of victory.
     */
    average_win_margin: number;
    /**
     * Average total score.
     */
    average_score: number;
    /**
     * Average autonomous score.
     */
    average_auto_score: number;
    /**
     * Average crossing score.
     */
    average_crossing_score: number;
    /**
     * Average boulder score.
     */
    average_boulder_score: number;
    /**
     * Average tower score.
     */
    average_tower_score: number;
    /**
     * Average foul score.
     */
    average_foul_score: number;
    /**
     * An array with three values, high score, match key from the match with the high score, and the name of the match.
     */
    high_score: Array<string>;
};

