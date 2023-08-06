/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Rsvp = {
    id: string;
    eventId: string;
    userId: string;
    status: Rsvp.status | null;
    delay: number | null;
    createdAt: string;
    updatedAt: string;
    checkinTime: string | null;
    checkoutTime: string | null;
};

export namespace Rsvp {

    export enum status {
        LATE = 'LATE',
        MAYBE = 'MAYBE',
        NO = 'NO',
        YES = 'YES',
    }


}
