/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type User = {
    id: string;
    username: string;
    createdAt: string;
    updatedAt: string;
    defaultStatus: User.defaultStatus | null;
    roles: Array<string>;
};

export namespace User {

    export enum defaultStatus {
        LATE = 'LATE',
        MAYBE = 'MAYBE',
        NO = 'NO',
        YES = 'YES',
    }


}

