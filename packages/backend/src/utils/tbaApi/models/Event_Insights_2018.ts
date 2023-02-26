/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Insights for FIRST Power Up qualification and elimination matches.
 */
export type Event_Insights_2018 = {
    /**
     * An array with three values, number of times auto quest was completed, number of opportunities to complete the auto quest, and percentage.
     */
    auto_quest_achieved: Array<number>;
    /**
     * Average number of boost power up scored (out of 3).
     */
    average_boost_played: number;
    /**
     * Average endgame points.
     */
    average_endgame_points: number;
    /**
     * Average number of force power up scored (out of 3).
     */
    average_force_played: number;
    /**
     * Average foul score.
     */
    average_foul_score: number;
    /**
     * Average points scored during auto.
     */
    average_points_auto: number;
    /**
     * Average points scored during teleop.
     */
    average_points_teleop: number;
    /**
     * Average mobility points scored during auto.
     */
    average_run_points_auto: number;
    /**
     * Average scale ownership points scored.
     */
    average_scale_ownership_points: number;
    /**
     * Average scale ownership points scored during auto.
     */
    average_scale_ownership_points_auto: number;
    /**
     * Average scale ownership points scored during teleop.
     */
    average_scale_ownership_points_teleop: number;
    /**
     * Average score.
     */
    average_score: number;
    /**
     * Average switch ownership points scored.
     */
    average_switch_ownership_points: number;
    /**
     * Average switch ownership points scored during auto.
     */
    average_switch_ownership_points_auto: number;
    /**
     * Average switch ownership points scored during teleop.
     */
    average_switch_ownership_points_teleop: number;
    /**
     * Average value points scored.
     */
    average_vault_points: number;
    /**
     * Average margin of victory.
     */
    average_win_margin: number;
    /**
     * Average winning score.
     */
    average_win_score: number;
    /**
     * An array with three values, number of times a boost power up was played, number of opportunities to play a boost power up, and percentage.
     */
    boost_played_counts: Array<number>;
    /**
     * An array with three values, number of times a climb occurred, number of opportunities to climb, and percentage.
     */
    climb_counts: Array<number>;
    /**
     * An array with three values, number of times an alliance faced the boss, number of opportunities to face the boss, and percentage.
     */
    face_the_boss_achieved: Array<number>;
    /**
     * An array with three values, number of times a force power up was played, number of opportunities to play a force power up, and percentage.
     */
    force_played_counts: Array<number>;
    /**
     * An array with three values, high score, match key from the match with the high score, and the name of the match
     */
    high_score: Array<string>;
    /**
     * An array with three values, number of times a levitate power up was played, number of opportunities to play a levitate power up, and percentage.
     */
    levitate_played_counts: Array<number>;
    /**
     * An array with three values, number of times a team scored mobility points in auto, number of opportunities to score mobility points in auto, and percentage.
     */
    run_counts_auto: Array<number>;
    /**
     * Average scale neutral percentage.
     */
    scale_neutral_percentage: number;
    /**
     * Average scale neutral percentage during auto.
     */
    scale_neutral_percentage_auto: number;
    /**
     * Average scale neutral percentage during teleop.
     */
    scale_neutral_percentage_teleop: number;
    /**
     * An array with three values, number of times a switch was owned during auto, number of opportunities to own a switch during auto, and percentage.
     */
    switch_owned_counts_auto: Array<number>;
    /**
     * An array with three values, number of times a unicorn match (Win + Auto Quest + Face the Boss) occurred, number of opportunities to have a unicorn match, and percentage.
     */
    unicorn_matches: Array<number>;
    /**
     * Average opposing switch denail percentage for the winning alliance during teleop.
     */
    winning_opp_switch_denial_percentage_teleop: number;
    /**
     * Average own switch ownership percentage for the winning alliance.
     */
    winning_own_switch_ownership_percentage: number;
    /**
     * Average own switch ownership percentage for the winning alliance during auto.
     */
    winning_own_switch_ownership_percentage_auto: number;
    /**
     * Average own switch ownership percentage for the winning alliance during teleop.
     */
    winning_own_switch_ownership_percentage_teleop: number;
    /**
     * Average scale ownership percentage for the winning alliance.
     */
    winning_scale_ownership_percentage: number;
    /**
     * Average scale ownership percentage for the winning alliance during auto.
     */
    winning_scale_ownership_percentage_auto: number;
    /**
     * Average scale ownership percentage for the winning alliance during teleop.
     */
    winning_scale_ownership_percentage_teleop: number;
};

