/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateRsvpDto = {
    eventId?: string;
    status?: UpdateRsvpDto.status;
    attended?: boolean;
};

export namespace UpdateRsvpDto {

    export enum status {
        LATE = 'LATE',
        MAYBE = 'MAYBE',
        NO = 'NO',
        YES = 'YES',
    }


}
