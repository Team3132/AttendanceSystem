/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Team_Simple = {
    /**
     * TBA team key with the format `frcXXXX` with `XXXX` representing the team number.
     */
    key: string;
    /**
     * Official team number issued by FIRST.
     */
    team_number: number;
    /**
     * Team nickname provided by FIRST.
     */
    nickname?: string;
    /**
     * Official long name registered with FIRST.
     */
    name: string;
    /**
     * City of team derived from parsing the address registered with FIRST.
     */
    city?: string;
    /**
     * State of team derived from parsing the address registered with FIRST.
     */
    state_prov?: string;
    /**
     * Country of team derived from parsing the address registered with FIRST.
     */
    country?: string;
};

