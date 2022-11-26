/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Rsvp = {
    id: string;
    eventId: string;
    userId: string;
    status: Rsvp.status;
    createdAt: string;
    updatedAt: string;
};

export namespace Rsvp {

    export enum status {
        YES = 'YES',
        NO = 'NO',
        MAYBE = 'MAYBE',
    }


}

