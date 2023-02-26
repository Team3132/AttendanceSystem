/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Team = {
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
     * Name of team school or affilited group registered with FIRST.
     */
    school_name?: string;
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
    /**
     * Will be NULL, for future development.
     */
    address?: string;
    /**
     * Postal code from the team address.
     */
    postal_code?: string;
    /**
     * Will be NULL, for future development.
     */
    gmaps_place_id?: string;
    /**
     * Will be NULL, for future development.
     */
    gmaps_url?: string;
    /**
     * Will be NULL, for future development.
     */
    lat?: number;
    /**
     * Will be NULL, for future development.
     */
    lng?: number;
    /**
     * Will be NULL, for future development.
     */
    location_name?: string;
    /**
     * Official website associated with the team.
     */
    website?: string;
    /**
     * First year the team officially competed.
     */
    rookie_year?: number;
    /**
     * Team's motto as provided by FIRST. This field is deprecated and will return null - will be removed at end-of-season in 2019.
     */
    motto?: string;
    /**
     * Location of the team's home championship each year as a key-value pair. The year (as a string) is the key, and the city is the value.
     */
    home_championship?: any;
};

