/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateEventDto = {
    description?: string;
    title: string;
    startDate: string;
    endDate: string;
    allDay?: boolean;
    type: CreateEventDto.type;
};

export namespace CreateEventDto {

    export enum type {
        OUTREACH = 'Outreach',
        REGULAR = 'Regular',
        SOCIAL = 'Social',
    }


}

