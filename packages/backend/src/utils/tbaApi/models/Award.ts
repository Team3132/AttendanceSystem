/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Award_Recipient } from './Award_Recipient';

export type Award = {
    /**
     * The name of the award as provided by FIRST. May vary for the same award type.
     */
    name: string;
    /**
     * Type of award given. See https://github.com/the-blue-alliance/the-blue-alliance/blob/master/consts/award_type.py#L6
     */
    award_type: number;
    /**
     * The event_key of the event the award was won at.
     */
    event_key: string;
    /**
     * A list of recipients of the award at the event. May have either a team_key or an awardee, both, or neither (in the case the award wasn't awarded at the event).
     */
    recipient_list: Array<Award_Recipient>;
    /**
     * The year this award was won.
     */
    year: number;
};

