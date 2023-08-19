/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EventResponse = {
    id: string;
    description: string;
    title: string;
    startDate: string;
    endDate: string;
    allDay: boolean;
    type: EventResponse.type;
    isSyncedEvent: boolean;
};

export namespace EventResponse {

    export enum type {
        SOCIAL = 'Social',
        REGULAR = 'Regular',
        OUTREACH = 'Outreach',
        MENTOR = 'Mentor',
    }


}
