/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateAttendanceDto = {
    eventId?: string;
    userId?: string;
    status?: UpdateAttendanceDto.status;
};

export namespace UpdateAttendanceDto {

    export enum status {
        ATTENDED = 'ATTENDED',
        NOT_ATTENDED = 'NOT_ATTENDED',
    }


}

