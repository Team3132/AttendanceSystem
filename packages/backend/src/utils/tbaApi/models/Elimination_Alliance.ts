/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WLT_Record } from './WLT_Record';

export type Elimination_Alliance = {
    /**
     * Alliance name, may be null.
     */
    name?: string;
    /**
     * Backup team called in, may be null.
     */
    backup?: {
        /**
         * Team key that was called in as the backup.
         */
        in?: string;
        /**
         * Team key that was replaced by the backup team.
         */
        out?: string;
    };
    /**
     * List of teams that declined the alliance.
     */
    declines?: Array<string>;
    /**
     * List of team keys picked for the alliance. First pick is captain.
     */
    picks: Array<string>;
    status?: {
        playoff_average?: number;
        level?: string;
        record?: WLT_Record;
        current_level_record?: WLT_Record;
        status?: string;
    };
};

