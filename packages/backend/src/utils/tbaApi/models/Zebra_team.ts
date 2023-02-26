/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Zebra_team = {
    /**
     * The TBA team key for the Zebra MotionWorks data.
     */
    team_key: string;
    /**
     * A list containing doubles and nulls representing a teams X position in feet at the corresponding timestamp. A null value represents no tracking data for a given timestamp.
     */
    xs: Array<number>;
    /**
     * A list containing doubles and nulls representing a teams Y position in feet at the corresponding timestamp. A null value represents no tracking data for a given timestamp.
     */
    ys: Array<number>;
};

