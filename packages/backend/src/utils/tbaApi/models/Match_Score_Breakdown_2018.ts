/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Match_Score_Breakdown_2018_Alliance } from './Match_Score_Breakdown_2018_Alliance';

/**
 * See the 2018 FMS API documentation for a description of each value. https://frcevents2.docs.apiary.io/#/reference/match-results/score-details
 */
export type Match_Score_Breakdown_2018 = {
    blue?: Match_Score_Breakdown_2018_Alliance;
    red?: Match_Score_Breakdown_2018_Alliance;
};

