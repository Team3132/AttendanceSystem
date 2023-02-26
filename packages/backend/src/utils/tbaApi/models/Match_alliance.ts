/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Match_alliance = {
    /**
     * Score for this alliance. Will be null or -1 for an unplayed match.
     */
    score: number;
    team_keys: Array<string>;
    /**
     * TBA team keys (eg `frc254`) of any teams playing as a surrogate.
     */
    surrogate_team_keys?: Array<string>;
    /**
     * TBA team keys (eg `frc254`) of any disqualified teams.
     */
    dq_team_keys?: Array<string>;
};

