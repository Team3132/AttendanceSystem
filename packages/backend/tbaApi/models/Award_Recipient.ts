/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An `Award_Recipient` object represents the team and/or person who received an award at an event.
 */
export type Award_Recipient = {
    /**
     * The TBA team key for the team that was given the award. May be null.
     */
    team_key?: string;
    /**
     * The name of the individual given the award. May be null.
     */
    awardee?: string;
};

