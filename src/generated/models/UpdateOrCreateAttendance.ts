/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateOrCreateAttendance = {
    status: UpdateOrCreateAttendance.status;
};

export namespace UpdateOrCreateAttendance {

    export enum status {
        ATTENDED = 'ATTENDED',
        NOT_ATTENDED = 'NOT_ATTENDED',
    }


}
