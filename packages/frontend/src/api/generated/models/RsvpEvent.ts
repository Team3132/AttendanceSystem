/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EventResponse } from './EventResponse';

export type RsvpEvent = {
    id: string;
    eventId: string;
    userId: string;
    status: RsvpEvent.status | null;
    delay: number | null;
    createdAt: string;
    updatedAt: string;
    checkinTime: string | null;
    checkoutTime: string | null;
    event: EventResponse;
};

export namespace RsvpEvent {

    export enum status {
        LATE = 'LATE',
        MAYBE = 'MAYBE',
        NO = 'NO',
        YES = 'YES',
    }


}
