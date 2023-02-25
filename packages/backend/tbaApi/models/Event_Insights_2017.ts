/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Insights for FIRST STEAMWORKS qualification and elimination matches.
 */
export type Event_Insights_2017 = {
    /**
     * Average foul score.
     */
    average_foul_score: number;
    /**
     * Average fuel points scored.
     */
    average_fuel_points: number;
    /**
     * Average fuel points scored during auto.
     */
    average_fuel_points_auto: number;
    /**
     * Average fuel points scored during teleop.
     */
    average_fuel_points_teleop: number;
    /**
     * Average points scored in the high goal.
     */
    average_high_goals: number;
    /**
     * Average points scored in the high goal during auto.
     */
    average_high_goals_auto: number;
    /**
     * Average points scored in the high goal during teleop.
     */
    average_high_goals_teleop: number;
    /**
     * Average points scored in the low goal.
     */
    average_low_goals: number;
    /**
     * Average points scored in the low goal during auto.
     */
    average_low_goals_auto: number;
    /**
     * Average points scored in the low goal during teleop.
     */
    average_low_goals_teleop: number;
    /**
     * Average mobility points scored during auto.
     */
    average_mobility_points_auto: number;
    /**
     * Average points scored during auto.
     */
    average_points_auto: number;
    /**
     * Average points scored during teleop.
     */
    average_points_teleop: number;
    /**
     * Average rotor points scored.
     */
    average_rotor_points: number;
    /**
     * Average rotor points scored during auto.
     */
    average_rotor_points_auto: number;
    /**
     * Average rotor points scored during teleop.
     */
    average_rotor_points_teleop: number;
    /**
     * Average score.
     */
    average_score: number;
    /**
     * Average takeoff points scored during teleop.
     */
    average_takeoff_points_teleop: number;
    /**
     * Average margin of victory.
     */
    average_win_margin: number;
    /**
     * Average winning score.
     */
    average_win_score: number;
    /**
     * An array with three values, kPa scored, match key from the match with the high kPa, and the name of the match
     */
    high_kpa: Array<string>;
    /**
     * An array with three values, high score, match key from the match with the high score, and the name of the match
     */
    high_score: Array<string>;
    /**
     * An array with three values, number of times kPa bonus achieved, number of opportunities to bonus, and percentage.
     */
    kpa_achieved: Array<number>;
    /**
     * An array with three values, number of times mobility bonus achieved, number of opportunities to bonus, and percentage.
     */
    mobility_counts: Array<number>;
    /**
     * An array with three values, number of times rotor 1 engaged, number of opportunities to engage, and percentage.
     */
    rotor_1_engaged: Array<number>;
    /**
     * An array with three values, number of times rotor 1 engaged in auto, number of opportunities to engage in auto, and percentage.
     */
    rotor_1_engaged_auto: Array<number>;
    /**
     * An array with three values, number of times rotor 2 engaged, number of opportunities to engage, and percentage.
     */
    rotor_2_engaged: Array<number>;
    /**
     * An array with three values, number of times rotor 2 engaged in auto, number of opportunities to engage in auto, and percentage.
     */
    rotor_2_engaged_auto: Array<number>;
    /**
     * An array with three values, number of times rotor 3 engaged, number of opportunities to engage, and percentage.
     */
    rotor_3_engaged: Array<number>;
    /**
     * An array with three values, number of times rotor 4 engaged, number of opportunities to engage, and percentage.
     */
    rotor_4_engaged: Array<number>;
    /**
     * An array with three values, number of times takeoff was counted, number of opportunities to takeoff, and percentage.
     */
    takeoff_counts: Array<number>;
    /**
     * An array with three values, number of times a unicorn match (Win + kPa & Rotor Bonuses) occured, number of opportunities to have a unicorn match, and percentage.
     */
    unicorn_matches: Array<number>;
};

