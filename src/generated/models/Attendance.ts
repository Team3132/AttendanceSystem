/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Attendance = {
    id: string;
    eventId: string;
    userId: string;
    status: Attendance.status;
    createdAt: string;
    updatedAt: string;
};

export namespace Attendance {

    export enum status {
        ATTENDED = 'ATTENDED',
        NOT_ATTENDED = 'NOT_ATTENDED',
    }


}

