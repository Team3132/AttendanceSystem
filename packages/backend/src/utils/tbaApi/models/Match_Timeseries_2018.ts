/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Timeseries data for the 2018 game *FIRST* POWER UP.
 * *WARNING:* This is *not* official data, and is subject to a significant possibility of error, or missing data. Do not rely on this data for any purpose. In fact, pretend we made it up.
 * *WARNING:* This model is currently under active development and may change at any time, including in breaking ways.
 */
export type Match_Timeseries_2018 = {
    /**
     * TBA event key with the format yyyy[EVENT_CODE], where yyyy is the year, and EVENT_CODE is the event code of the event.
     */
    event_key?: string;
    /**
     * Match ID consisting of the level, match number, and set number, eg `qm45` or `f1m1`.
     */
    match_id?: string;
    /**
     * Current mode of play, can be `pre_match`, `auto`, `telop`, or `post_match`.
     */
    mode?: string;
    play?: number;
    /**
     * Amount of time remaining in the match, only valid during `auto` and `teleop` modes.
     */
    time_remaining?: number;
    /**
     * 1 if the blue alliance is credited with the AUTO QUEST, 0 if not.
     */
    blue_auto_quest?: number;
    /**
     * Number of POWER CUBES in the BOOST section of the blue alliance VAULT.
     */
    blue_boost_count?: number;
    /**
     * Returns 1 if the blue alliance BOOST was played, or 0 if not played.
     */
    blue_boost_played?: number;
    /**
     * Name of the current blue alliance POWER UP being played, or `null`.
     */
    blue_current_powerup?: string;
    /**
     * 1 if the blue alliance is credited with FACING THE BOSS, 0 if not.
     */
    blue_face_the_boss?: number;
    /**
     * Number of POWER CUBES in the FORCE section of the blue alliance VAULT.
     */
    blue_force_count?: number;
    /**
     * Returns 1 if the blue alliance FORCE was played, or 0 if not played.
     */
    blue_force_played?: number;
    /**
     * Number of POWER CUBES in the LEVITATE section of the blue alliance VAULT.
     */
    blue_levitate_count?: number;
    /**
     * Returns 1 if the blue alliance LEVITATE was played, or 0 if not played.
     */
    blue_levitate_played?: number;
    /**
     * Number of seconds remaining in the blue alliance POWER UP time, or 0 if none is active.
     */
    blue_powerup_time_remaining?: string;
    /**
     * 1 if the blue alliance owns the SCALE, 0 if not.
     */
    blue_scale_owned?: number;
    /**
     * Current score for the blue alliance.
     */
    blue_score?: number;
    /**
     * 1 if the blue alliance owns their SWITCH, 0 if not.
     */
    blue_switch_owned?: number;
    /**
     * 1 if the red alliance is credited with the AUTO QUEST, 0 if not.
     */
    red_auto_quest?: number;
    /**
     * Number of POWER CUBES in the BOOST section of the red alliance VAULT.
     */
    red_boost_count?: number;
    /**
     * Returns 1 if the red alliance BOOST was played, or 0 if not played.
     */
    red_boost_played?: number;
    /**
     * Name of the current red alliance POWER UP being played, or `null`.
     */
    red_current_powerup?: string;
    /**
     * 1 if the red alliance is credited with FACING THE BOSS, 0 if not.
     */
    red_face_the_boss?: number;
    /**
     * Number of POWER CUBES in the FORCE section of the red alliance VAULT.
     */
    red_force_count?: number;
    /**
     * Returns 1 if the red alliance FORCE was played, or 0 if not played.
     */
    red_force_played?: number;
    /**
     * Number of POWER CUBES in the LEVITATE section of the red alliance VAULT.
     */
    red_levitate_count?: number;
    /**
     * Returns 1 if the red alliance LEVITATE was played, or 0 if not played.
     */
    red_levitate_played?: number;
    /**
     * Number of seconds remaining in the red alliance POWER UP time, or 0 if none is active.
     */
    red_powerup_time_remaining?: string;
    /**
     * 1 if the red alliance owns the SCALE, 0 if not.
     */
    red_scale_owned?: number;
    /**
     * Current score for the red alliance.
     */
    red_score?: number;
    /**
     * 1 if the red alliance owns their SWITCH, 0 if not.
     */
    red_switch_owned?: number;
};

