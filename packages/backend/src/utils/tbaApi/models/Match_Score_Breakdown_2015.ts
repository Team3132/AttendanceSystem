/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Match_Score_Breakdown_2015_Alliance } from './Match_Score_Breakdown_2015_Alliance';

/**
 * See the 2015 FMS API documentation for a description of each value
 */
export type Match_Score_Breakdown_2015 = {
    blue?: Match_Score_Breakdown_2015_Alliance;
    red?: Match_Score_Breakdown_2015_Alliance;
    coopertition?: Match_Score_Breakdown_2015.coopertition;
    coopertition_points?: number;
};

export namespace Match_Score_Breakdown_2015 {

    export enum coopertition {
        NONE = 'None',
        UNKNOWN = 'Unknown',
        STACK = 'Stack',
    }


}

