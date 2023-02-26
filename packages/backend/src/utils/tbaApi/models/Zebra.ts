/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Zebra_team } from './Zebra_team';

export type Zebra = {
    /**
     * TBA match key with the format `yyyy[EVENT_CODE]_[COMP_LEVEL]m[MATCH_NUMBER]`, where `yyyy` is the year, and `EVENT_CODE` is the event code of the event, `COMP_LEVEL` is (qm, ef, qf, sf, f), and `MATCH_NUMBER` is the match number in the competition level. A set number may be appended to the competition level if more than one match in required per set.
     */
    key: string;
    /**
     * A list of relative timestamps for each data point. Each timestamp will correspond to the X and Y value at the same index in a team xs and ys arrays. `times`, all teams `xs` and all teams `ys` are guarenteed to be the same length.
     */
    times: Array<number>;
    alliances: {
        /**
         * Zebra MotionWorks data for teams on the red alliance
         */
        red?: Array<Zebra_team>;
        /**
         * Zebra data for teams on the blue alliance
         */
        blue?: Array<Zebra_team>;
    };
};

