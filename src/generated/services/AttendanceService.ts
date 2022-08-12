/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Attendance } from '../models/Attendance';
import type { CreateAttendanceDto } from '../models/CreateAttendanceDto';
import type { UpdateAttendanceDto } from '../models/UpdateAttendanceDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AttendanceService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create a new Attendance
     * @param requestBody 
     * @returns Attendance 
     * @returns any 
     * @throws ApiError
     */
    public attendanceControllerCreate(
requestBody: CreateAttendanceDto,
): CancelablePromise<Attendance | any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/attendance',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Attendance 
     * @throws ApiError
     */
    public attendanceControllerFindAll(): CancelablePromise<Array<Attendance>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/attendance',
        });
    }

    /**
     * Get a specific attendance status
     * @param id 
     * @returns Attendance 
     * @throws ApiError
     */
    public attendanceControllerFindOne(
id: string,
): CancelablePromise<Attendance> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/attendance/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update an Attendance status
     * @param id 
     * @param requestBody 
     * @returns Attendance 
     * @throws ApiError
     */
    public attendanceControllerUpdate(
id: string,
requestBody: UpdateAttendanceDto,
): CancelablePromise<Attendance> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/attendance/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete an attendance
     * @param id 
     * @returns Attendance 
     * @throws ApiError
     */
    public attendanceControllerRemove(
id: string,
): CancelablePromise<Attendance> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/attendance/{id}',
            path: {
                'id': id,
            },
        });
    }

}
