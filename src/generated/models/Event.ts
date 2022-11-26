/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Event = {
    id: string;
    description: string;
    title: string;
    startDate: string;
    endDate: string;
    allDay: boolean;
    type: Event.type;
};

export namespace Event {

    export enum type {
        OUTREACH = 'Outreach',
        REGULAR = 'Regular',
        SOCIAL = 'Social',
    }


}

