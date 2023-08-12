/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateOrCreateRSVP = {
    status: UpdateOrCreateRSVP.status;
    delay: number | null;
};

export namespace UpdateOrCreateRSVP {

    export enum status {
        LATE = 'LATE',
        MAYBE = 'MAYBE',
        NO = 'NO',
        YES = 'YES',
    }


}

