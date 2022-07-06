/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateAttendanceDto = {
    eventId: string;
    userId: string;
    status: CreateAttendanceDto.status;
};

export namespace CreateAttendanceDto {

    export enum status {
        ATTENDED = 'ATTENDED',
        NOT_ATTENDED = 'NOT_ATTENDED',
    }


}
