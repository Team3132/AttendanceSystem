/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateEventDto = {
    description?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    allDay?: boolean;
    type: UpdateEventDto.type;
};

export namespace UpdateEventDto {

    export enum type {
        OUTREACH = 'Outreach',
        REGULAR = 'Regular',
        SOCIAL = 'Social',
    }


}

